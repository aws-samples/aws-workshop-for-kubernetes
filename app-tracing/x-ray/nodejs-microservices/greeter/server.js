'use strict';

// Include the AWS X-Ray Node.js SDK and set configuration
var XRay = require('aws-xray-sdk');
var AWS  = require('aws-sdk');
const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

AWS.config.region = process.env.REGION
XRay.config([XRay.plugins.EC2Plugin, XRay.plugins.ECSPlugin]);


// App
const app = express();
app.use(XRay.express.openSegment('greeter-svc'));

app.get('/*', (req, res) => {
  	var greet = 'Hello';
	
	var seg = XRay.getSegment();
	seg.addAnnotation('greet_req', req.query['greet']);
	
  	console.log('greet[greet]: ' + req.query['greet']);

	if (req.query['greet'] == 'ho') {
		greet = 'Howdy';
	}

  res.send(greet);
});

app.use(XRay.express.closeSegment());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

