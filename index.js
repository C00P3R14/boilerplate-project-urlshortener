require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('node:dns');

// Basic Configuration
const port = process.env.PORT || 3000;

//shorturl

let shortUrl;
let originalURL;

//helper functions
function isValidURL(string) {
  try {
    new URL(string)
    return true
  } catch (error) {
    return false
  }
}

app.use(cors());

app.use(bodyParser.urlencoded({extended:true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.route('/api/shorturl/:shorturl?')
.post((req,res,next) => {
  dns.lookup(req.body.url,(err,family) => {
    if(err) {
      console.error(err)
      return res.json({error: "invalid url"})
    } else {
      originalURL = req.body.url
    shortUrl = Math.floor(Math.random() * 1000)
    res.json({original_url:req.body.url,short_url:shortUrl})
    return next()
    }
  })
  //res.shorturl = Math.floor(Math.random() * 1000)
  /*if(isValidURL(req.body.url)) {
    originalURL = req.body.url
    shortUrl = Math.floor(Math.random() * 1000)
    res.json({original_url:req.body.url,short_url:shortUrl})
    return next()
  } else {
  dns.lookup(req.body.url,(err,address,family) => {
     if(err) {return res.json({error: "invalid url"})}
  })}*/
  
})
.get((req,res,next) => {
  console.log(`params: ${req.params.shorturl} shorturl: ${shortUrl}`)
  if(Number(req.params.shorturl) === shortUrl) {
    const fullOriginalAddress = 'http://' + originalURL
    res.redirect(originalURL)
    return res.end()
  } else {
  return res.json({error: "invalid url"})}
})

/*app.route('/api/shorturl/:shorturl?')
.post((req,res,next) => {
  //res.shorturl = Math.floor(Math.random() * 1000)
  dns.lookup(req.body.url,(err,address,family) => {
    if(err) {
      dns.resolve(req.body.url,(err) => {
        if(err) {
        console.error(err)
      res.json({error: "invalid url"})
      return res.end()
        } else {
          originalURL = req.body.url
      shortUrl = Math.floor(Math.random() * 1000)
      res.json({original_url:req.body.url,short_url:shortUrl})
      return next()
        }
      })
    } else {
      originalURL = req.body.url
      shortUrl = Math.floor(Math.random() * 1000)
      res.json({original_url:req.body.url,short_url:shortUrl})
      return next()
    }
  })
})
.get((req,res,next) => {
  console.log(`params: ${req.params.shorturl} shorturl: ${shortUrl}`)
  if(Number(req.params.shorturl) === shortUrl) {
    const fullOriginalAddress = 'http://' + originalURL
    res.redirect(fullOriginalAddress)
    return res.end()
  } else {
  return res.json({error: "invalid url"})}
})*/



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
