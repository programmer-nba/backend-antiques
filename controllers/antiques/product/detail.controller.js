const { Detail } = require("../../../models/antiques/product/detail.model");

module.exports.create = async (req, res) => {
	try {
		const detail = await Detail.findOne({
			name: req.body.name,
		});
		if (detail) {
			return res.status(409).send({
				status: false,
				message: "มีประเภทสินค้านี้ในระบบแล้ว",
			});
		} else {
			await new Detail({
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
module.exports.getDetailAll = async (req, res) => {
	try {
		const detail = await Detail.find();
		if (!detail)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: detail });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" });
	}
};

// Get type by id
module.exports.getDetailById = async (req, res) => {
	try {
		const detail = await Detail.findById(req.params.id);
		if (!detail)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: detail });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" });
	}
};

// Delete type
module.exports.deleteDetail = async (req, res) => {
	try {
		const id = req.params.id;
		Detail.findByIdAndDelete(id, { useFindAndModify: false }).then((data) => {
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

module.exports.updateDetail = async (req, res) => {
	try {
		const id = req.params.id;
		Detail.findByIdAndUpdate(id, req.body, { useFindAndModify: false, }).then((data) => {
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