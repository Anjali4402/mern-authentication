
// Create custom class for Error Handling
// ErrorHandler will take all properties from the prebuild "Error" class

class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
    }
};

// Crete error Middleware
export const errorMiddleware = (err, req, res, next)=> {

    err.statusCode = err.statusCode || 500 , // if we have any errorStatus code in that above function then show the unless by default show 500
    err.message = err.message || "Internal server error.",

    console.log(err);
    

    // handle error
    if(err.name === 'CastError'){
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message, 400)
    };

    if(err.name === 'JsonWebTokenError'){
        const message = `Json Web Token is invalid, Try again.`;
        err = new ErrorHandler(message, 400)
    };

    if(err.name === 'TokenExpiredError'){
        const message = `Json Web Token is expired, Try again.`;
        err = new ErrorHandler(message, 400)
    };


    // show this error when , duplicate issue in Database. // or issue related to Database
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    };

    return res.status(err.statusCode).json({
        success : false,
        message : err.message,
    })

};

export default ErrorHandler;