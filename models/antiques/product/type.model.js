const mongoose = require("mongoose");

const TypeSchema = new mongoose.Schema({
	cate_id: { type: String, required: true },
	name: { type: String, required: true },
	emp: { type: String, required: false, default: "ไม่มี" },
});

const Type = mongoose.model("product_type", TypeSchema);

module.exports = { Type }