const { Category } = require("../../../models/antiques/product/category.model");

module.exports.create = async (req, res) => {
	try {
		const category = await Category.findOne({
			name: req.body.name,
		});
		if (category) {
			return res.status(409).send({
				status: false,
				message: "มีประเภทสินค้านี้ในระบบแล้ว",
			});
		} else {
			await new Category({
				...req.body,
			}).save();
			return res.status(201).send({ message: "เพิ่มข้อมูลประเภทสินค้าทำเร็จ", status: true });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
}

// Get All category
module.exports.getCategoryAll = async (req, res) => {
	try {
		const category = await Category.find();
		if (!category)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: category });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" });
	}
};

// Get category by id
module.exports.getCategoryById = async (req, res) => {
	try {
		const category = await Category.findById(req.params.id);
		if (!category)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: category });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" });
	}
};

// Delete category
module.exports.deleteCategory = async (req, res) => {
	try {
		const id = req.params.id;
		Category.findByIdAndDelete(id, { useFindAndModify: false }).then((data) => {
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

module.exports.updateCategory = async (req, res) => {
	try {
		const id = req.params.id;
		Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false, }).then((data) => {
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