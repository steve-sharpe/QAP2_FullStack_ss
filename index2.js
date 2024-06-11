const http = require('http');
const fs = require('fs');
const EventEmitter = require('events');
global.DEBUG = true;
class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();

const logEvents = require('./logEvents.js');

myEmitter.on('serverStarted', (message) => {
    console.log(message)
    logEvents('Server started')
})

myEmitter.on('pageVisited', (message) => {
    console.log(message)
    logEvents(message)
})

myEmitter.on('pageNotFound', (message) => {
    console.log(message)
    logEvents(message)
})

const server = http.createServer((req, res) => {
    if (req.url === "/favicon.ico") {
      res.writeHead(204, { "Content-Type": "image/x-icon" });
      res.end();
      return;
    }

    let filePath = "./views/";
    switch (req.url) {
      case "/":
        filePath += "home.html";
        break;
      case "/about.html":
        filePath += "about.html";
        break;
      case "/contact.html":
        filePath += "contact.html";
        break;
      case "/faq.html":
        filePath += "faq.html";
        break;
        case "/products.html":
        filePath += "products.html";
        break;
      case "/links.html":
        filePath += "links.html";
        break;
      default:
        filePath = null;
    }

    if (filePath) {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                myEmitter.emit('pageNotFound', `Route ${req.url} not found`);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
                myEmitter.emit('pageVisited', `Serving ${req.url}`);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        myEmitter.emit('pageNotFound', `Route ${req.url} not found`);
    }
})

server.listen(3000, 'localhost', () => {
    myEmitter.emit('serverStarted', 'Server started');
    console.log('Server is listening on port 3000');
});