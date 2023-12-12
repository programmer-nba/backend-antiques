const mongoose = require("mongoose");
const Joi = require("joi");

const adminantiquesSchema = new mongoose.Schema(
    {
        telephone: {type:String},
        name: {type:String},
        username : {type:String},
        password :{type:String},
        level :{type:String},
        roles :{type:String},
        createAt:{type:Date},
        updateAt:{type:Date}

    },
    {timestamp: true}
);
const validateLogin = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().label("invalid username"),
    password: Joi.string().required().label("invalid password"),
  });

  return schema.validate(data);
};

const admin_register = mongoose.model('Admin', adminantiquesSchema);
module.exports =  admin_register ;

