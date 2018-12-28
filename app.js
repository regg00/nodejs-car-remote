// initialize required components
const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const Gpio = require("onoff").Gpio
const { createLogger, format, transports } = require('winston')

const gpioStart = process.env.START || 24
//const gpioUnlock = process.env.UNLOCK || 24
const interval = process.env.INTERVAL || 3000
const port = process.env.PORT || 3000
const secret = process.env.SECRET || "changethis"

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
var startRelay = new Gpio(gpioStart, 'out')
//var unlockRelay = new Gpio(gpioUnlock, 'out')
startRelay.writeSync(1)
//unlockRelay.writeSync(1)

// configure the application to use body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// test route
app.get('/healthcheck', function (req, res){
    logger.debug('Healthcheck')
    res.status(200)  
    res.send("healthcheck")
})

// car startup route
app.get('/start', function(req, res){
    // get token from post data and check if it's valid    
    if (req.query.token == secret){
        // if valid, start the car by activating the GPIO pin connected to the start switch for 2 seconds
        // ensure that the relay is off
        startRelay.writeSync(1)
        logger.debug('set startRelay to 1')

        // turn on the relay
        startRelay.writeSync(0)
        logger.debug('set startRelay to 0')

        // turn off after x seconds
        setTimeout(function(){
            startRelay.writeSync(1)
            console.log('turning off the relay after ' + interval + ' ms timeout')
        },interval)
        
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

// start the application
app.listen(port, function(){
    logger.info('car remote RESTful API server started on port: ' + port + '\r\nSecret: ' + secret)
})