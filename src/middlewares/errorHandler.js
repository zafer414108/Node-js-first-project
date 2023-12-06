const APIError = require("../utils/errors");

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof APIError) {
        return res.status(err.statusCode || 400)
            .json({
                success: false,
                message: err.message
            })
    }

    console.log(err.name);
    
    return res.status(500).json({
        success: false,
        message: "Error occured with api. Please control your API !",
        original: err.message
    })
}

module.exports = errorHandlerMiddleware;