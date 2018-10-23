// initialize required components
const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const config = require("./config.js")
const Gpio = require("onoff").Gpio
const { createLogger, format, transports } = require('winston')
const logger = createLogger({
  level: 'debug',
  format: format.combine(
      format.colorize(),
      format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),    
  transports: [new transports.Console()]
})

// initialize the relays and ensure that they are off
var startRelay = new Gpio(config.gpioStart, 'out')
var unlockRelay = new Gpio(config.gpioUnlock, 'out')
startRelay.writeSync(1)
unlockRelay.writeSync(1)

// configure the application to use body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// test route
app.get('/test', function (req, res){
    logger.debug('test received')    
    res.send("ok")
})

// car startup route
app.post('/start', function(req, res){
    // get token from post data and check if it's valid    
    if (req.body.token == config.secret){
        // if valid, start the car by activating the GPIO pin connected to the start switch for 2 seconds
        // ensure that the relay is off
        startRelay.writeSync(1)
        logger.debug('set startRelay to 1')

        // turn on the relay
        startRelay.writeSync(0)
        logger.debug('set startRelay to 0')

        // turn off after 2 seconds
        setTimeout(function(){
            startRelay.writeSync(1)
            console.log('turning off the relay after 2 seconds timeout')
        },2000)
        
        res.status(200)
        res.send("car started")
    }
    
    // if the token is invalid, return error code
    else {        
        res.status(401);
        res.send("unauthorized")
        logger.warn('unauthorized access')
    }    
})

// car unlock route
app.post('/unlock', function(req, res){
    // get token from post data and check if it's valid    
    if (req.body.token == config.secret){   
        // ensure that the relay is off
        unlockRelay.writeSync(1)
        logger.debug('set unlockRelay to 1')
        
        // turn on the relay 2 times within 1 second
        setInterval(function(){            
            unlockRelay.writeSync(0)
            console.log('turn on the unlock relay')
            setTimeout(function(){
                unlockRelay.writeSync(1)
                console.log('let go of the unlock relay')
            }, 250)                        
        }, 500)        

        // turn off completely after 1 second
        setTimeout(function(){
            unlockRelay.writeSync(1)
            console.log('turn off the relay after 1 second')
        },1000)

        res.status(200)
        res.send("car unlocked")
        logger.info('car unlocked')
    }

    // if not valid, return error code
    else {        
        res.status(401);
        res.send("unauthorized")
        logger.warn('unauthorized access')
    }
    
})

// start the application
app.listen(config.port)

// write startup message to console
logger.info('car remote RESTful API server started on: ' + config.port)