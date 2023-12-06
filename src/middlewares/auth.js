const jwt = require("jsonwebtoken");
const APIError = require("../utils/errors");
const user = require("../models/user.model");

const createToken = async (user, res) => {

    const payload = {
        sub: user._id,
        name: user.name
    }
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: "HS512",
        expiresIn: process.env.JWT_EXPIRES_IN
    })


    return res.status(201).json({
        success: true,
        token,
        message: "Başarılı"
    });
}

const tokenCheck = async (req, res, next) => {

    const headerToken = req.headers.authorization && req.headers.authorization.startsWith("Bearer ");

    if (!headerToken)
        throw new APIError("Invalid Login Credentials Please Login", 401)

    const inComingToken = req.headers.authorization.split(" ")[1];

    await jwt.verify(inComingToken, process.env.JWT_SECRET_KEY, async (err, decoded) => {

        if (err) throw new APIError("Invalid Token", 401);

        const userInfo = await user
            .findById(decoded.sub)
            .select("_id name lastname email");

        if (!userInfo)
            throw new APIError("Invalid Token", 401);

        req.user = userInfo;
        next();
    });

}

const createTemporaryToken = async (userId, email) => {

    const payload = {
        sub: userId,
        name: email
    }
    const token = await jwt.sign(payload, process.env.JWT_TEMPORARY_SECRET_KEY, {
        algorithm: "HS512",
        expiresIn: process.env.JWT_TEMPORARY_EXPIRES_IN
    })

    return "Bearer " + token
}

const decodedTemporaryToken = async (temproraryToken) => {
    const token = temproraryToken.split(" ")[1];
    let userInfo;

    await jwt.verify(token, process.env.JWT_TEMPORARY_SECRET_KEY, async (err, decoded) => {
        if (err) throw new APIError("Invalid Token", 401)

        userInfo = await user.findById(decoded.sub).select("_id name lastname email")
        if (!userInfo) throw new APIError("Invalid Token", 401)
    })

    return userInfo
}

module.exports = {
    createToken,
    tokenCheck,
    createTemporaryToken,
    decodedTemporaryToken
}