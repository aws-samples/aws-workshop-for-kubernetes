'use strict';

// Include the AWS X-Ray Node.js SDK and set configuration
var XRay = require('aws-xray-sdk');
var AWS = XRay.captureAWS(require('aws-sdk'));
const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

AWS.config.region = process.env.REGION
XRay.config([XRay.plugins.EC2Plugin, XRay.plugins.ECSPlugin]);

// App
const app = express();
app.use(XRay.express.openSegment('name-svc'));


app.get('/*', (req, res) => {
  	var name = 'Arun';

	var seg = XRay.getSegment();
	seg.addAnnotation('name_req', req.query['id']);
	
  	console.log('name[id]: ' + req.query['id']);
  	
	if (req.query['id'] == '1') {
		name = 'Sheldon';
	}

  res.send(name);
});

app.use(XRay.express.closeSegment());
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

