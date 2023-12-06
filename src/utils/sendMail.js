const nodeMailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (mailOptions) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }

    })

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Hata Çıktı Mail Gönderilemedi : ", error);
        }

        console.log("info content : ", info);
        return true;

    })
}

module.exports = sendEmail