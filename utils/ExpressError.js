//Extend default Error class with message, and code status for API requests
class ExpressError extends Error{
    constructor(message, statusCode){
        super();
        this.message = message;
        this.status = statusCode;
    }
}

module.exports = ExpressError;