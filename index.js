//requirements
const http = require('http')
const https = require('https')
const express = require('express')
const gpt = require('./gpt_load')
const fs = require('fs')
const ua = require('express-useragent')
const gpt_load = require('./gpt_load')

//init express
const app = express()
app.use(express.static('public'))
app.use(
    express.urlencoded({
        extended: true,
    }),
    express.json(),
    ua.express()
)

//certification ssl
const ssl_cert = {
    cert: fs.readFileSync('./ssl/cert.crt'),
    ca: fs.readFileSync('./ssl/flywer_xyz.ca-bundle'),
    key: fs.readFileSync('./ssl/key.pem')
  }

//starting the https server on port 443
const httpsServer = https.createServer(ssl_cert, app)
httpsServer.listen(443, () => {
    console.log('ready')
})

//redirection
const httpServer = http.createServer((request, response) => {
    response.statusCode = 301;
    response.setHeader('Location', `https://monde.flywer.xyz${request.url}`);
    response.end();
});
httpServer.listen(80)

app.get('/', (req, rep) => {
    if(req.useragent.isMobile) {
        rep.writeHead(200, { 'content-type': 'text/html' })
        fs.createReadStream('./public/html/home.html').pipe(rep)
    } else {
        rep.writeHead(200, { 'content-type': 'text/html' })
        fs.createReadStream('./public/html/nocomp.html').pipe(rep)
    }
})
app.get('/infos', (req, rep) => {
    if(req.useragent.isMobile) {
        rep.writeHead(200, { 'content-type': 'text/html' })
        fs.createReadStream('./public/html/infos.html').pipe(rep)
    } else {
        rep.writeHead(200, { 'content-type': 'text/html' })
        fs.createReadStream('./public/html/nocomp.html').pipe(rep)
    }
})
app.get('/tip', (req, rep) => {
    gpt_load.ask((dat) => {
        let tp = dat
        rep.send(tp)
    })
})

