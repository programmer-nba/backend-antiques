const mongoose = require("mongoose");

const PriceSchema = new mongoose.Schema({
	cate_id: { type: String, required: true },
	type_id: { type: String, required: true },
	detail_id: { type: String, required: true },
	price: { type: String, required: true },
	emp: { type: String, required: false, default: "ไม่มี" },
});

const Price = mongoose.model("product_Price", PriceSchema);

module.exports = { Price }