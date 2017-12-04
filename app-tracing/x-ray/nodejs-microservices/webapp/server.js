'use strict';

// Include the AWS X-Ray Node.js SDK and set configuration
//ref:  https://docs.aws.amazon.com/xray-sdk-for-nodejs/latest/reference/
const XRay = require('aws-xray-sdk');
const AWS  = XRay.captureAWS(require('aws-sdk'));
const http = XRay.captureHTTPs(require('http'));
const express = require('express');
// const request = require('sync-request');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
AWS.config.region = process.env.REGION

XRay.config([XRay.plugins.EC2Plugin, XRay.plugins.ECSPlugin]);
//XRay.middleware.setSamplingRules('sampling-rules.json');
XRay.middleware.enableDynamicNaming('*.elb.amazonaws.com');

// App
const app = express();
app.use(XRay.express.openSegment('webapp'));

app.get('/', (req, res) => {
	let seg = XRay.getSegment();
	seg.addAnnotation('param_greet', req.query['greet']);
	seg.addAnnotation('param_id', req.query['id']);

	getContent({hostname:`${process.env.GREETER_SERVICE_HOST}` ,port:process.env.GREETER_SERVICE_PORT, path: `/${process.env.GREETER_SERVICE_PATH}?greet=${req.query['greet']}`})
	.then( function (html){ 
		console.log (html); 
		var output1 = html;
		// console.log(`output = ${output1}`);
		getContent({hostname:`${process.env.NAME_SERVICE_HOST}` ,port:process.env.NAME_SERVICE_PORT, path: `/${process.env.NAME_SERVICE_PATH}?id=${req.query['id']}`})
		.then(function (html2){
			console.log(html2);	
			var output2 = html2;
			// console.log (output1 + output2);
			res.send(output1 +' ' +  output2);
		})
		.catch((err) => console.error(err));
	})
	.catch((err) => console.error(err));

});


// --------------------------------------------------------
// function get(url) {
// 	return require('sync-request')('GET', url).getBody();
// }

function getContent(option) {
	// return new pending promise
	return new Promise((resolve, reject) => {
		const httpreq = http.request(option, (res) => {
			// console.log(`STATUS: ${res.statusCode}`);
			//console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
			res.setEncoding('utf8');
			var data = '';
			res.on('data', (chunk) => {
				data += chunk;
			});
			res.on('end', () => {
				var result = data;
				// console.log(`result=${result}`);
				resolve(result);
			});
		});
		httpreq.on('error', (e) => {
			console.error(`problem with request: ${e.message}`);
			reject(new Error(`problem with request: ${e.message}`));
		});
		httpreq.end();
	})
};

app.use(XRay.express.closeSegment());
app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);

