# Create kubeconfig script
#title           create-kubeconfig.sh
#description     This script will create a kubeconfig file based on the EKS cluster k8s-workshop.
#author          @buzzsurfr
#contributors    @buzzsurfr @dalbhanj @cloudymind
#date            2018-06-07
#version         0.2
#usage           curl -sSL https://s3.amazonaws.com/aws-kubernetes-artifacts/v0.5/create-kubeconfig.sh | bash -s stable
#==============================================================================

# Download kubeconfig template
mkdir $HOME/.kube
aws s3 cp s3://aws-kubernetes-artifacts/v0.5/config-k8s-workshop $HOME/.kube/config

# Configure based on EKS cluster k8s-workshop
sed -i -e "s#<endpoint-url>#$(aws eks describe-cluster --name k8s-workshop --query cluster.endpoint --output text)#g" $HOME/.kube/config
sed -i -e "s#<base64-encoded-ca-cert>#$(aws eks describe-cluster --name k8s-workshop --query cluster.certificateAuthority.data --output text)#g" $HOME/.kube/config
sed -i -e "s#<cluster-name>#k8s-workshop#g" $HOME/.kube/config
sed -i -e "s#<role-arn>#$EKS_SERVICE_ROLE#g" $HOME/.kube/config
