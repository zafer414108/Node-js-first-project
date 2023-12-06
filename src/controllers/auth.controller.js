const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken, createTemporaryToken, decodedTemporaryToken } = require("../middlewares/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const moment = require("moment/moment");

const login = async (req,res) => {

    console.log("LOGIN");
    const {email, password} = req.body;
    
    const userInfo = await user.findOne({email});

    if(!userInfo) {
        throw new APIError("Email yada Şifre Hatalıdır !",401);
    }

    const isPassTrue = await bcrypt.compare(password, userInfo.password);

    if(!isPassTrue) {
        throw new APIError("Email veya Şifre Hatalıdır !",401);
    }


    createToken(userInfo, res);
}


const register = async (req,res) => {

    const { email } = req.body;

     //değişken ismide email olduğu için {email:email} yerine bu şekildede kullanılabiliyor
    const userCheck = await user.findOne({email});

    if(userCheck) {

        throw new APIError("Email is exist", 401);

    }

    req.body.password = await bcrypt.hash(req.body.password, 10);

    console.log("Hashed Password :", req.body.password);

    const userSave = new user(req.body);

    await userSave.save()
        .then((data) => {

            return new Response(data,"Record Added Successfully").created(res);

            return res.status(201).json({
                        success: true,
                        data: data,
                        message: "Record Added Successfully"
        })

                })
                .catch((err) => {
                   throw new APIError("User not inserted to db",400); 
                })

}

const me = async (req, res) => {
    
    return new Response(req.user).success(res);
}

const forgetPassword = async (req,res) => {
    const { email } = req.body;

    const userInfo = await user.findOne({email}).select(" name lastname email ");

    if (!userInfo) return new APIError("Invalid User", 400);

    console.log(userInfo);

    const resetCode = crypto.randomBytes(3).toString("hex");

    await sendEmail({
        from:"tatlicak@ataytekbilisim.com",
        to: userInfo.email,
        subject: "Şifre Sıfırlama",
        text: `Şifre Sıfırlama Kodunuz ${resetCode}`

    })

    await user.updateOne(
        {email},
        {
            reset: {
                code: resetCode,
                time: moment(new Date()).add(15, "minute").format("YYYY-MM-DD HH:mm:ss")
            }
        }
    )

    return new Response(true, "Please Check Your Mailbox").success(res)
}

const resetCodeCheck = async (req, res) => {
    const { email, code} =req.body;

    const userInfo = await user.findOne({}).select("_id name lastname email reset")

    if (!userInfo) throw new APIError("Invalid Code !", 401);

    const dbTime = moment(userInfo.reset.time);
    const nowTime = moment(new Date());

    const timeDiff = dbTime.diff(nowTime, "minutes");
    console.log("Time Diff : ", timeDiff);

    if(timeDiff <= 0 || userInfo.reset.code !== code)
        throw new APIError("Invalid Code",401)

     const temporaryToken = await createTemporaryToken(userInfo._id, userInfo.email);

     return new Response({temporaryToken}, "You can reset yor password...").success(res)
     
    }

    const resetPassword = async (req, res) => {
        const { password, temporaryToken } = req.body

        console.log("Req Body : ",req.body);
    

        const decodedToken = await decodedTemporaryToken(temporaryToken);
        console.log("Decoded Token : ", decodedToken);

        const hashPassword = await bcrypt.hash(password, 10);

        await user.findByIdAndUpdate(
            { _id: decodedToken._id},
            {
                reset: {
                    code: null,
                    time: null
                },

                password: hashPassword
            }
            
            );
            return new Response(decodedToken, "Reseting Password is successful").success(res);
    };

module.exports = {
    login,
    register,
    me,
    forgetPassword,
    resetCodeCheck,
    resetPassword
}