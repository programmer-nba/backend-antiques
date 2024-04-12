const { Admins } = require("../models/user/antiques_admin.model");
const { Employees } = require("../models/user/antiques_employee.model");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const validate = (data) => {
  const schema = Joi.object({
    username: Joi.string().required().label("username"),
    password: Joi.string().required().label("password"),
  });
  return schema.validate(data);
};


module.exports.Login = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    let admin = await Admins.findOne({
      admin_username: req.body.username,
    });
    if (!admin) {
      // console.log("ไม่ใช่แอดมิน")
      await checkEmployee(req, res);
    } else {
      const validPasswordAdmin = await bcrypt.compare(
        req.body.password,
        admin.admin_password
      );
      if (!validPasswordAdmin)
        // รหัสไม่ตรง
        return res.status(401).send({
          message: "password is not find",
          status: false,
        });
      const token = admin.generateAuthToken();
      const ResponesData = {
        name: admin.admin_name,
        username: admin.admin_username,
      };
      return res.status(200).send({
        token: token,
        message: "เข้าสู่ระบบสำเร็จ",
        result: ResponesData,
        level: "admin",
        status: true,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

const checkEmployee = async (req, res) => {
  try {
    let employee = await Employees.findOne({
      employee_username: req.body.username,
    });
    if (!employee) {
      return res.status(401).send({
        message: "username is not find",
        status: false,
      });
    } else {
      const validPasswordEmployee = await bcrypt.compare(
        req.body.password,
        employee.employee_password
      );
      if (!validPasswordEmployee)
        // รหัสไม่ตรง
        return res.status(401).send({
          message: "password is not find",
          status: false,
        });
      const token = employee.generateAuthToken();
      const ResponesData = {
        name: employee.employee_name,
        username: employee.employee_iden,
        phone: employee.employee_phone,
        position: employee.employee_position
      };
      return res.status(200).send({
        token: token,
        message: "เข้าสู่ระบบสำเร็จ",
        result: ResponesData,
        level: "landlord",
        status: true,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};