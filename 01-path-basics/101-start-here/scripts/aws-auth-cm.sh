# aws-auth ConfigMap script
#title           aws-auth-cm.sh
#description     This script will add a ConfigMap aws-auth to the EKS cluster k8s-workshop, allowing the worker nodes to join the cluster.
#author          @buzzsurfr
#contributors    @buzzsurfr @dalbhanj @cloudymind
#date            2018-06-05
#version         0.1
#usage           curl -sSL https://s3.amazonaws.com/aws-kubernetes-artifacts/v0.5/aws-auth-cm.sh | bash -s stable
#==============================================================================

curl -O https://amazon-eks.s3-us-west-2.amazonaws.com/1.10.3/2018-06-05/aws-auth-cm.yaml
export EKS_WORKER_ROLE=$(aws cloudformation describe-stacks --stack-name k8s-workshop-worker-nodes | jq -r '.Stacks[0].Outputs[]|select(.OutputKey=="NodeInstanceRole")|.OutputValue')
sed -i -e "s#<ARN of instance role (not instance profile)>#${EKS_WORKER_ROLE}#g" aws-auth-cm.yaml
kubectl apply -f aws-auth-cm.yaml
