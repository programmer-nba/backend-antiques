const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
	name: { type: String, required: true },
	emp: { type: String, required: false, default: "ไม่มี" },
});

const Category = mongoose.model("product_category", CategorySchema);

module.exports = { Category }