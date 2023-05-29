//Extend default Error class with message, and code status for API requests

/*
defines a custom error class called ExpressError that extends the built-in JavaScript Error class.
 This custom error class is designed to be used with the Express framework,
 as it includes an additional statusCode property for HTTP status codes.


Here's a breakdown of the ExpressError class:

The constructor of the ExpressError class takes two arguments: message and statusCode.
The super() function is called to inherit the base Error class properties and methods.
The message property is set to the provided message argument.
A new property called status is added and set to the provided statusCode argument.

By creating a custom error class like ExpressError, you can throw errors with both a message and an HTTP status code,
 making it easier to handle errors and send appropriate responses in your Express application.
 */
class ExpressError extends Error{
    constructor(message, statusCode){
        super();
        this.message = message;
        this.status = statusCode;
    }
}

module.exports = ExpressError;