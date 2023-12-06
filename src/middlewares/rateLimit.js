const rateLimit = require("express-rate-limit");
const allowList = ["::1"];

const apiLimiter = rateLimit({
    windowsMs: 15*60*1000,
    max: (req,res) => {
        console.log("api url : ", req.url);
        console.log("api ip : ", req.ip);
        if (req.url === "/login" || req.url === "/register") return 5
        else 100
    },
    message: {
        success: false,
        message: "Too much request attempt ... !"
    },
    skip:(req,res) => allowList.includes(req.ip),
    standardHeaders:true,
    legacyHeader: false,

})

module.exports = apiLimiter