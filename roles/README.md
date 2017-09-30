# Kubernetes - Applying IAM Roles

## Introduction

Out of the box, Kubernetes supports 2 types of roles: a master IAM role and a node IAM role.

In addition, the 3rd party plugin [kube2iam](https://github.com/jtblin/kube2iam) can be configured to apply IAM roles at the pod level.

This excerise will walk you through configuring both concepts.

## IAM Master / Node Roles

Out of the box, masters have a number of pre-configured EC2, ELB, ECR, Route53 and KMS policies applied, with nodes having a number of EC2, ECR and Route53 policies applied (see [here](https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md) for a full list).

These policies may be augmented via kops.  For example, to allow all nodes ElasticSearch access, perform the following steps:

> Edit your cluster via `kops edit cluster ${CLUSTER_NAME}` and add the following to the spec:

```
  additionalPolicies:
    node: |
      [
        {
          "Effect": "Allow",
          "Action": ["es:*"],
          "Resource": ["*"]
        }
      ]
```

> Update the cluster for changes to take effect:

```
kops update cluster ${CLUSTER_NAME} --yes
```

In a similar fashion, policies may be applied to all masters by setting the `additionalPolicies.master` property.


## IAM Container Roles

[kube2iam](https://github.com/jtblin/kube2iam), once configured, will provide the opportunity of configuring a role per pod.

Kube2iam works by intercepting traffic from the containers to the EC2 Metadata API, calling the AWS STS API to obtain temporary credentials using the pod configured role, then using these temporary credentials to perform the original request.

### Install kube2iam

The following steps describe how to configure kube2iam:

> Edit your cluster via `kops edit cluster ${CLUSTER_NAME}` and add the following to the spec to allow STS to assume roles:

```
  additionalPolicies:
    node: |
      [
        {
          "Effect": "Allow",
          "Action": ["sts:AssumeRole"],
          "Resource": ["*"]
        }
      ]
```

> Update the cluster for changes to take effect:

```
kops update cluster ${CLUSTER_NAME} --yes
```

> Deploy kube2iam as a daemonset.  Note that the `kube2iam-ds.yaml` is assuming that your network configuration is based on kops.  If you have changed this as part of another exercise (e.g. switched to Calico) you will need to change the value of the `--host-interface` arg (e.g. set to `cal+` if using Calico).

```
kubectl create -f kube2iam-ds.yaml
```

### Configure a Pod IAM Role

> We need the IAM Instance Profile ARN assigned to the worker nodes.  We will need this as part of creating a pod role.  We can obtain this by running the following command:

```
kubectl get no --selector=kubernetes.io/role==node -o jsonpath='{.items[0].spec.externalID}' | xargs aws ec2 describe-instances --instance-id --query 'Reservations[*].Instances[*].IamInstanceProfile.Arn'
```

> Edit the `Pod-Role-Trust-Policy.json` file, replacing `{{NodeIamInstanceProfileARN}}` with the IAM Instance Profile ARN obtained from the previous step.
> We will first create a role with no permissions.  By configuring the Trusted Policy of the role, we are allowing kube2iam (via the worker node IAM Instance Profile Role) to assume the pod role.  Make note of the role ARN from the response:

```
aws iam create-role --role-name MyPodRole --assume-role-policy-document file://Pod-Role-Trust-Policy.json"
```

> To assign an IAM role to a pod, we set the `iam.amazonaws.com/role` annotation of the pod.  View `aws-cli-po.yaml` as an example.  Run the following which will create a pod with the AWS CLI already installed, with the `MyPodRole` IAM role assigned.

```
kubectl create -f aws-cli-po.yaml
```

> Log into the `aws-cli` pod that we have just deployed:

```
kubectl exec -it aws-cli /bin/bash
```

>  We will use the AWS CLI to attempt to access S3.  Recall that the `MyPodRole` IAM role that we created has no permissions, therefore the following should fail:

```
aws s3 ls
```

> Exit the pod, then kill it.

```
exit
kubectl delete po aws-cli --force
```

> Let's update the role to grant S3 permissions:

```
aws iam attach-role-policy --role-name MyPodRole --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
```

> Recreate the pod, log into it, then try to access S3 again.  We should now be authorized!

```
kubectl create -f aws-cli-po.yaml
kubectl exec -it aws-cli /bin/bash
aws s3 ls
```

### Additional Notes

As kube2iam caches STS tokens for 15 minutes, if you make any changes to a role and need it to take effect immediately, you will need to restart the pod.

To govern what roles a pod can assume, you can use the `iam.amazonaws.com/allowed-roles` namespace annotation.  For example, the following will only allow pods to assume our MyPodRole:

```
apiVersion: v1
kind: Namespace
metadata:
  annotations:
    iam.amazonaws.com/allowed-roles: |
      ["arn:aws:iam::123456789012:role/MyPodRole"]
  name: default
```