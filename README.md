# Node.js car remote

Simple RESTful API built with express to control my car remotely.

## Disclaimer

If you are looking for a complete solution to remote control your car from anywhere, this isn't the repo for you.

This code simply activate a relay hooked to a Raspberry PI which is soldered to my car remote and simulate a button press. So the application will work ONLY within range of the car remote.

I guess someone could hook the Pi to a car with a LTE modem and a battery so that it can be started remotely from anywhere in the world, but it's out of the scope of this project.

## Why I did this
Laziness is the mother of invention. 

Also, this allow me to start my car with my phone on those cold Quebec winter mornings without reaching for my keys.

The startup could also be scheduled with a simple cron job.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development or production purposes.

### Requirements

* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/en/) 
* [Body parser](https://github.com/expressjs/body-parser)

### Configuration

All configuration is stored under the **config.json** file. Only change this file if you want to run the app quickly with minimal effort.

1. Change the **secret** (very important)
2. Change the **port** (optional)
3. Change the **gpioStart** and **gpioUnlock** values to reflect your current setup

### Installing requirements

1. Execute `npm install`

### Running the application

1. Execute `npm start`

## Built With

* [Node.js](https://nodejs.org/en/)
* [Visual Studio Code](https://code.visualstudio.com/)

## Authors

* **regg00@gmail.com** - *Initial work* - [regg00](https://github.com/regg00)


## Donation
If that helped you, let me know by email. You can also support me with this link : https://paypal.me/regg00

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details