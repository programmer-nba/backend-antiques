const {PercentCourier , validate } = require("../../models/express.model/precent.courier.model")

exports.create = async(req, res)=>{
    try{
        const {error} = validate(req.body);
        if(error){
            return  res.status(400).send({message : error.details[0].message, status : false});
        }
        const check_courier = await PercentCourier.findOne({courier_code:req.body.courier_code});
        if(check_courier){
            return res.status(400).send({message: "รหัสคูเรียนี้มีในระบบแล้ว"})
        }
        const percent = await PercentCourier.create(req.body);
        if(percent){
            return res.status(201).send({message: "เพิ่มข้อมูลสำเร็จ"});
        }else{
            return res.status(401).send({message : "เพิ่มข้อมูลไม่สำเร็จ กรุณาทำรายอีกครั้ง"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : err._message});
    }
}

exports.getAll = async(req,res) => {
    try{
        const percent = await PercentCourier.find();
        if(percent){
            return res.status(200).send({status: true, data: percent});
        }else{
            return res.status(400).send({status: false, message : "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message})
    }
}

exports.getById = async(req, res)=>{
    try{
        const id = req.params.id;
        const percent = await PercentCourier.findById(id);
        if(percent){
            return res.status(200).send({status: true, data: percent});
        }else{
            return res.status(400).send({status:true, message: "ดึงข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message : err._message});
    }
}

exports.update = async(req, res)=>{
    try{
        const id = req.params.id;
        const percent  = await PercentCourier.findByIdAndUpdate(id, req.body);
        if(percent){
            return res.status(200).send({status: true, message : "แก้ไขข้อมูลสำเร็จ"})
        }else{
            return res.status(400).send({status: false, message : "แก้ไขข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message})
    }
}

exports.delete = async(req, res)=>{
    try{
        const id = req.params.id;
        const percent = await PercentCourier.findByIdAndDelete(id);
        if(percent){
            return res.status(200).send({status: true, message: "ลบข้อมูลสำเร็จ"})
        }else{
            return res.status(400).send({status: false, message : "ลบข้อมูลไม่สำเร็จ"})
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({message: err._message});
    }
}