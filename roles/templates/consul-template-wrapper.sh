#!/bin/sh

# Write /root/.aws/config

cat << EOF > /root/.aws/config
[default]
region = us-east-1
EOF

# Generate Vault token with k8s auth, get dynamic 
# AWS creds, and write AWS creds to /root/.aws/credentials

SERVICE_ACCOUNT_TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)

VAULT_TOKEN=$(curl -sb \
    --request POST \
    --data "{\"role\": \"demo\", \"jwt\": \"${SERVICE_ACCOUNT_TOKEN}\"}" \
    "${VAULT_ADDR}/v1/auth/kubernetes/login" | jq -r '.auth .client_token')

/bin/consul-template \
    --vault-token=$VAULT_TOKEN \
    --vault-addr=$VAULT_ADDR \
    --vault-renew-token=false \
    -template "/config.ctmpl:/root/.aws/credentials"
Add Comment Collapse