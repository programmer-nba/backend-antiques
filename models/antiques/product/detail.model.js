const mongoose = require("mongoose");

const DetailSchema = new mongoose.Schema({
	cate_id: { type: String, required: true },
	type_id: { type: String, required: true },
	name: { type: String, required: true },
	emp: { type: String, required: false, default: "ไม่มี" },
});

const Detail = mongoose.model("product_detail", DetailSchema);

module.exports = { Detail }