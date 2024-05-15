const { required } = require("joi");
const mongoose = require("mongoose");

const QueueSchema = new mongoose.Schema({
    queue_number : { type : String, required : false },
    queue_date : { type : String, required : false },
	customer_id : { type : String, required : true },
	product_detail : [{
        price_id : { type : String, required : false },
    }]
});

const Queue = mongoose.model("Queue", QueueSchema);

module.exports = { Queue }