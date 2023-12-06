const joi = require("joi");
const APIError = require("../../utils/errors");

class AuthValidation {
    constructor() {}
    static register = async(req, res, next) => {
        try {
            await joi.object({
                name: joi.string().trim().min(3).max(50).required().messages({
                    "string.base" : "İsim Alanı Normal Metin Olmalıdır",
                    "string.empty" : "İsim Alanı Boş Olamaz",
                    "string.min" : "İsim Alanı En Az 3 Karakter Olmalıdır ",
                    "string.max" : "İsim Alanı En Fazla 50 Karakter Olabilir",
                    "string.required" : "İsim Alanı Zorunludur"

                }),
                lastname: joi.string().trim().min(3).max(50).required().messages({
                    "string.base" : "Soyad Alanı Normal Metin Olmalıdır",
                    "string.empty" : "Soyad Alanı Boş Olamaz",
                    "string.min" : "Soyad Alanı En Az 3 Karakter Olmalıdır ",
                    "string.max" : "Soyad Alanı En Fazla 50 Karakter Olabilir",
                    "string.required" : "Soyad Alanı Zorunludur"

                }),

                email: joi.string().email().trim().min(3).max(50).required().messages({
                    "string.base" : "E-posta Alanı Normal Metin Olmalıdır",
                    "string.empty" : "E-posta Alanı Boş Olamaz",
                    "string.min" : "E-posta Alanı En Az 3 Karakter Olmalıdır ",
                    "string.email": "Lütfen Geçerli Bir E-posta Adresi Giriniz",
                    "string.max" : "E-posta Alanı En Fazla 50 Karakter Olabilir",
                    "string.required" : "E-posta Alanı Zorunludur"

                }),
                password: joi.string().trim().min(8).max(36).required().messages({
                    "string.base" : "Şifre Alanı Normal Metin Olmalıdır",
                    "string.empty" : "Şifre Alanı Boş Olamaz",
                    "string.min" : "Şifre Alanı En Az 8 Karakter Olmalıdır ",
                    "string.max" : "Şifre Alanı En Fazla 36 Karakter Olabilir",
                    "string.required" : "Şifre Alanı Zorunludur"

                })
            }).validateAsync(req.body)
        } catch (error) {
            if(error.details && error?.details[0].message)
                throw new APIError(error.details[0].message, 400);
            else throw new APIError("Lütfen Validasyon Kurallarına Uyun...", 400);
            console.log(error.detail[0]);
        }
        next();
    }


    static login = async (req,res, next) => {
        try {
                await joi.object({
                    email: joi.string().email().trim().min(3).max(50).required().messages({
                        "string.base" : "E-posta Alanı Normal Metin Olmalıdır",
                        "string.empty" : "E-posta Alanı Boş Olamaz",
                        "string.min" : "E-posta Alanı En Az 3 Karakter Olmalıdır ",
                        "string.email": "Lütfen Geçerli Bir E-posta Adresi Giriniz",
                        "string.max" : "E-posta Alanı En Fazla 50 Karakter Olabilir",
                        "string.required" : "E-posta Alanı Zorunludur"
    
                    }),
                    password: joi.string().trim().min(8).max(36).required().messages({
                        "string.base" : "Şifre Alanı Normal Metin Olmalıdır",
                        "string.empty" : "Şifre Alanı Boş Olamaz",
                        "string.min" : "Şifre Alanı En Az 8 Karakter Olmalıdır ",
                        "string.max" : "Şifre Alanı En Fazla 36 Karakter Olabilir",
                        "string.required" : "Şifre Alanı Zorunludur"
    
                    })
                }).validateAsync(req.body)


        } catch (error) {
            if(error.details && error?.details[0].message)
                throw new APIError(error.details[0].message, 400);
            else throw new APIError("Lütfen Validasyon Kurallarına Uyun...", 400);
            console.log(error.detail[0]);
        }
        next();
    }
    }

    module.exports = AuthValidation;