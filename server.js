const express = require('express');
// const morgan = require('morgan');
const proxy = require('express-http-proxy');
const path = require('path');
const app = express();
const request = require('request')
const redisClient = require('./redis.js')
const indexHtml = require('./indexHtml.js');

// app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname, 'public')));


var body_highlights;
request('http://lb-yelp-highlights-93714774.us-west-1.elb.amazonaws.com/bundle.js', (err, response, body) => {
	// redisClient.set('body_highlights', JSON.stringify(body))
	body_highlights = body;
})

app.use('/main/:iterator', (req, res) => {
	var iterator = req.params.iterator;
	redisClient.get(iterator, (err, result) => {
		if (result) {
			res.send(indexHtml(JSON.parse(result), body_highlights));
		} else {
			const url = `http://lb-yelp-highlights-93714774.us-west-1.elb.amazonaws.com/api/highlights/ssr/${iterator}`;
			request(url, (err, response, body) => {
				res.send(indexHtml(body, body_highlights));
				redisClient.setex(iterator, 60, JSON.stringify(body));
			})
		}
	})
})

// app.use('/main/:id', proxy('http://localhost:3003/main/highlights/ssr/:id', {
//   proxyReqPathResolver: function(req) {
//     return `http://localhost:3003/main/highlights/ssr/` + req.params.id;
//   }
// }));

// app.get('/:id', function(req, res){
//   res.sendFile(path.join(__dirname + '/public/index.html'));
// })

const port = process.env.PORT || 80;
app.listen(port, function(){
  console.log(`proxy server is live on port ${port}!`)
})

// app.use('/title-bar/restaurant/:id', proxy('http://52.8.109.246/title-bar/restaurant/:id', {
//   proxyReqPathResolver: function(req) {
//     return `http://52.8.109.246/title-bar/restaurant/` + req.params.id;
//   }
// }));

// app.use('/highlights/reviews/:id', proxy('http://54.241.166.39/highlights/reviews/:id', {
//   proxyReqPathResolver: function(req) {
//     return `http://54.241.166.39/highlights/reviews/` + req.params.id;
//   }
// }));

// app.use('/highlights/photos/:id', proxy('http://54.241.166.39/highlights/photos/:id', {
//   proxyReqPathResolver: function(req) {
//     return `http://54.241.166.39/highlights/photos/` + req.params.id;
//   }
// }));

// app.use('/reviews/reviews/:id', proxy('http://13.57.136.163/reviews/reviews/:id', {
//   proxyReqPathResolver: function(req) {
//     return `http://13.57.136.163/reviews/reviews/` + req.params.id;
//   }
// }));

// app.use('/reviews/user/:id', proxy('http://13.57.136.163/reviews/user/:id', {
//   proxyReqPathResolver: function(req) {
//     return `http://13.57.136.163/reviews/user/` + req.params.id;
//   }
// }));

// app.use(
//   "/sidebar/business/:id",
//   proxy("http://13.56.34.255/sidebar/business/:id", {
//     proxyReqPathResolver: function(req) {
//       return "http://52.53.200.182/sidebar/business/" + req.params.id;
//     }
//   })
// );
// app.use(
//   "/sidebar/postalCode/:code",
//   proxy("http://13.56.34.255/sidebar/postalCode/:code", {
//     proxyReqPathResolver: function(req) {
//       return "http://52.53.200.182/sidebar/postalCode/" + req.params.code;
//     }
//   })
// );
// app.use(
//   "/sidebar/businessTips/:id",
//   proxy("http://13.56.34.255/sidebar/businessTips/:id", {
//     proxyReqPathResolver: function(req) {
//       return "http://52.53.200.182/sidebar/businessTips/" + req.params.id;
//     }
//   })
// );

// app.use(
//   "/sidebar/photos/:id",
//   proxy("http://13.56.34.255/sidebar/photos/:id", {
//     proxyReqPathResolver: function(req) {
//       return "http://52.53.200.182/sidebar/photos/" + req.params.id;
//     }
//   })
// );

// app.get('/map-and-images/business/:id', proxy('http://34.216.201.147/map-and-images/business/:id', {
//   proxyReqPathResolver: function(req) {
//     return 'http://34.216.201.147/map-and-images/business/' + req.params.id;
//   }
// }));

// app.get('/map-and-images/business/:id/photos', proxy('http://34.216.201.147/map-and-images/business/:id/photos', {
//   proxyReqPathResolver: function(req) {
//     return 'http://34.216.201.147/map-and-images/business/' + req.params.id + '/photos';
//   }
// }));
