const { required } = require("joi");
const mongoose = require("mongoose");

const QueueSchema = new mongoose.Schema({
    receipt_number : { type : String, required : false },
    receipt_date : { type : Date, required : false },
    queue_number : { type : String, required : false },
    queue_date : { type : String, required : false },
	customer_id : { type : String, required : false },
    status : { type : String, required : false, default : "รอจ่ายเงิน"},
	product_detail : [{
        price_id : { type : String, required : false },
        qty : { type : Number, required : false },
        image : { type : String, required : false}
    }]
});

const Queue = mongoose.model("Queue", QueueSchema);

module.exports = { Queue }