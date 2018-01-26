from hashicorp/consul-template:alpine 

RUN apk add --no-cache jq
ADD consul-template-wrapper.sh /consul-template-wrapper.sh
ADD config.ctmpl /config.ctmpl
CMD ["sh", "/consul-template-wrapper.sh"]