import os
import socket
import os
from flask import Flask, request

#https://docs.aws.amazon.com/xray-sdk-for-python/latest/reference/basic.html
# #Lets try to use AWS X-ray for metrics / logging if available to us
try:
    from aws_xray_sdk.core import xray_recorder
    from aws_xray_sdk.core import patch_all
    from aws_xray_sdk.ext.flask.middleware import XRayMiddleware
    # xray_recorder.configure(context_missing=LOG_ERROR)
    # xray_recorder.configure(sampling=False)
    plugins = ('EC2Plugin','ECSPlugin')
    xray_recorder.configure(plugins=plugins)
    patch_all()
except:
    logging.exception('Failed to import X-ray')

app = Flask(__name__)


try:
    xray_recorder.configure(service='Flask App')
    XRayMiddleware(app, xray_recorder)
except:
    logging.exception('Failed to load X-ray')


@app.route('/')
def hello():
    return 'Hello Flask!'

@app.route("/hostname")
def return_hostname():
    return "This is an example wsgi app served from {} to {}".format(socket.gethostname(), request.remote_addr)

@app.route("/env")
def env():
  return  os.environ['AWS_XRAY_DAEMON_ADDRESS']


@app.route('/fib/<int:number>')
def index(number=1):
    result = fib(number)
    return "Python Fib("+ str(number) + "): " + str(result)

@xray_recorder.capture('Fibonnaci')
def fib(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fib(n - 1) + fib(n - 2)


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
