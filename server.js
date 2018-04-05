const express = require('express');
// const morgan = require('morgan');
const proxy = require('express-http-proxy');
const path = require('path');
const app = express();
const request = require('request')
const redisClient = require('./redis.js')
const indexHtml = require('./indexHtml.js');

const redis = require('redis');
//const redisClient = redis.createClient(6379, 'http://54.67.79.178');
// const redisClient = redis.createClient(6379, 'ec2-54-67-79-178.us-west-1.compute.amazonaws.com');
// redisClient.on('connect', () => {
//   console.log('Connected to redis!');
// });
// const redis = require('redis');
// const redisClient = redis.createClient(6379, 'http://54.67.79.178');
// redisClient.on('connect', () => {
//   console.log('Connected to redis!');
// });

// app.use(morgan('dev'));

app.use('/main/:id', proxy('http://lb-yelp-highlights-93714774.us-west-1.elb.amazonaws.com/api/highlights/ssr/:id', {
  proxyReqPathResolver: function(req) {
    return `http://lb-yelp-highlights-93714774.us-west-1.elb.amazonaws.com/api/highlights/ssr/` + req.params.id;
  }
}));


// app.use('/main/:iterator', (req, res) => {
// 	var iterator = req.params.iterator;
// 	const url = `http://lb-yelp-highlights-93714774.us-west-1.elb.amazonaws.com/api/highlights/ssr/${iterator}`;
// 	// request(url, (err, response, body) => {
// 	// 	res.send(indexHtml(body, 'http://lb-yelp-highlights-93714774.us-west-1.elb.amazonaws.com/bundle.js'));
// 	// })
// 	req.pipe(request(url)).pipe(res);
// })

// var body_highlights;
// request('http://lb-yelp-highlights-93714774.us-west-1.elb.amazonaws.com/bundle.js', (err, response, body) => {
// 	// redisClient.set('body_highlights', JSON.stringify(body))
// 	body_highlights = body;
// })

// app.use('/main/:iterator', (req, res) => {
// 	var iterator = req.params.iterator;
// 	redisClient.get(iterator, (err, result) => {
// 		if (result) {
// 			res.send(indexHtml(JSON.parse(result), body_highlights));
// 		} else {
// 			const url = `http://lb-yelp-highlights-93714774.us-west-1.elb.amazonaws.com/api/highlights/ssr/${iterator}`;
// 			request(url, (err, response, body) => {
// 				res.send(indexHtml(body, body_highlights));
// 				redisClient.setex(iterator, 60, JSON.stringify(body));
// 			})
// 		}
// 	})
// })

const port = process.env.PORT || 80;
app.listen(port, function(){
  console.log(`proxy server is live on port ${port}!`)
})
