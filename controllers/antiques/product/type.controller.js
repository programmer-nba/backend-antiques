const { Type } = require("../../../models/antiques/product/type.model");

module.exports.create = async (req, res) => {
	try {
		const type = await Type.findOne({
			name: req.body.name,
		});
		if (type) {
			return res.status(409).send({
				status: false,
				message: "มีประเภทสินค้านี้ในระบบแล้ว",
			});
		} else {
			await new Type({
				...req.body,
			}).save();
			return res.status(201).send({ message: "เพิ่มข้อมูลประเภทสินค้าทำเร็จ", status: true });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
}

// Get All type
module.exports.getTypeAll = async (req, res) => {
	try {
		const type = await Type.find();
		if (!type)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: type });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" });
	}
};

// Get type by id
module.exports.getTypeById = async (req, res) => {
	try {
		const type = await Type.findById(req.params.id);
		if (!type)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: type });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" });
	}
};

// Delete type
module.exports.deleteType = async (req, res) => {
	try {
		const id = req.params.id;
		Type.findByIdAndDelete(id, { useFindAndModify: false }).then((data) => {
			if (!data) {
				return res.status(404).send({ message: `ไม่สามารถลบรายงานนี้ได้`, status: false, });
			} else {
				return res.send({ message: "ลบรายงานนี้เรียบร้อยเเล้ว", status: true, });
			}
		}).catch((err) => {
			return res.status(500).send({ message: "ไม่สามารถลบรายงานนี้ได้", status: false, });
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.updateType = async (req, res) => {
	try {
		const id = req.params.id;
		Type.findByIdAndUpdate(id, req.body, { useFindAndModify: false, }).then((data) => {
			if (!data) {
				return res.status(404).send({
					message: `ไม่สามารถเเก้ไขรายงานนี้ได้`,
					status: false,
				});
			} else
				return res.send({
					message: "แก้ไขรายงานนี้เรียบร้อยเเล้ว",
					status: true,
				});
		}).catch((err) => {
			return res.status(500).send({
				message: "มีบ่างอย่างผิดพลาด",
				status: false,
			});
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
}