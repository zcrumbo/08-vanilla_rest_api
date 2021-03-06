'use strict';

const http = require('http');
const Chair = require('./model/entry.js');
const Router = require('./lib/router.js');
const storage = require('./lib/storage.js');
const PORT = process.env.PORT || 3000;
const router = new Router();




router.get('/api/chair', function(req, res){
  if(req.url.query.id) {
    storage.fetchItem('chair', req.url.query.id)
    .then( chair => {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.write(JSON.stringify(chair));
      res.end();
    }).catch( err => {
      console.error(err);
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.write('not found');
      res.end();
    });
    return;
  }
  res.writeHead(400, {
    'Content-Type': 'text/plain'
  });
  res.write('bad request');
  res.end();
});

router.post('/api/chair', function(req, res){
  try{
    var chair = new Chair(req.body.name, req.body.content);
    storage.createItem('chair', chair);
    res.writeHead(200,{
      'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(chair));
    res.end();
  } catch (err){
    console.error(err);
    res.writeHead(400, {
      'Content-Type':'text/plain'
    });
    res.write('bad request in server module');
    res.end();
  }
});

router.delete('/api/chair', function(req, res){
  if(req.url.query.id){
    storage.deleteItem('chair', req.url.query.id)
    .then( chair => {
      res.writeHead(204, {
        'Content-Type': 'application/json'
      });
      res.write(JSON.stringify(chair));
      res.end();
    }).catch( err => {
      console.error(err);
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.write('not found');
      res.end();
    });
    return;
  }
  res.writeHead(400, {
    'Content-Type': 'text/plain'
  });
  res.write('bad request');
  res.end();
});
const server = http.createServer(router.route());

server.listen(PORT, function(){
  console.log('server up on port:',PORT);
});