var jwt = require("jsonwebtoken");
var Register = require("../models/antiques/antiques_admin.model");
var bcrypt = require("bcrypt");

module.exports.CreateRegister = async (req, res) => {
    try{
        
        const telephone = req.body.telephone;
        const username = req.body.username;
        const password = await bcrypt.hash(req.body.password, 10);
        const level = req.body.level;
        var roles = req.body.roles;
        const createAt = Date.now();
        const updateAt = Date.now();


        if(level == 1){
            roles = "admin"
        }else if(level == 2){
            roles = "user"
        }else{
            roles = "cashier"
        }
 
        let regisData = {
            telephone: telephone,
            username: username,
            password: password,
            level: level,
            roles: roles,
            createAt: createAt,
            updateAt: updateAt
        }
        const chkNameRegis = await Register.find({username:username});

        if(chkNameRegis.length > 0){
            return res.status(500).send({message: "บัญชีนี้มีชื่อผู้ใช้งานแล้ว"});
        }else{
            const createRegis = new Register(regisData)
            const saveRegisData = await createRegis.save()
            return res.status(200).send({message: "บันทึกข้อมูลสำเร็จ",data: createRegis})
        }
    }catch{
        return res.status(500).send({message: "Internal Server Error"});
    }
}