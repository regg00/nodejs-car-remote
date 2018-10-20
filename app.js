// initialize required components
const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const config = require("./config.js")

// configure the application to use body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// test route
app.get('/test', function (req, res){
    res.send("ok")
})

// car startup route
app.post('/start', function(req, res){
    // get token from post data and check if it's valid    
    if (req.body.token == config.secret){
        // if valid, start the car by activating the GPIO pin connected to the start switch
        res.status(200)
        res.send("car started")
    }
    else {
        // if not valid, return error code
        res.status(401);
        res.send("unauthorized")
    }
    
})

// car unlock route
app.post('/unlock', function(req, res){
    // get token from post data and check if it's valid    
    if (req.body.token == config.secret){
        // if valid, unlock the car by activating the GPIO pin connected to the unlock switch
        res.status(200)
        res.send("car unlocked")
    }
    else {
        // if not valid, return error code
        res.status(401);
        res.send("unauthorized")
    }
    
})

// start the application
app.listen(config.port)

// write startup message to console
console.log('car remote RESTful API server started on: ' + config.port)





 
