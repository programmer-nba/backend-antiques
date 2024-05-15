const { Queue } = require("../../models/Queue/queue.model");
// const moment = require('moment');

module.exports.create = async (req, res) => {
    try {
        // Get today's date in YYYY/MM/DD format
        const today = new Date();
        const formattedToday = `${today.getFullYear()}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}`;

        // Find the latest queue document for today's date sorted by queue_number in descending order
        const latestQueue = await Queue.findOne({ queue_date: formattedToday }).sort({ queue_number: -1 }).limit(1);

        let queueid = 1;

        // If a latest queue exists, increment the queue number
        if (latestQueue) {
            queueid = parseInt(latestQueue.queue_number) + 1;
        }

        const QueueString = queueid.toString().padStart(2, '0');

        const newQueue = new Queue({
            queue_number: QueueString,
            queue_date: formattedToday,
            ...req.body,
        });
        await newQueue.save();

        return res.status(201).send({ message: "เพิ่มข้อมูลประเภทสินค้าสำเร็จ", status: true });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

// Get All
module.exports.getAll = async (req, res) => {
	try {
		const queue = await Queue.find();
		if (!queue)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: queue });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" });
	}
};

// Get by id
module.exports.getById = async (req, res) => {
	try {
		const queue = await Queue.findById(req.params.id);
		if (!queue)
			return res.status(403).send({ status: false, message: "ดึงข้อมูลไม่สำเร็จ" });
		return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: queue });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "มีบางอย่างผิดพลาด", error: "server side error" });
	}
};

// Delete
module.exports.delete = async (req, res) => {
	try {
		const id = req.params.id;
		Queue.findByIdAndDelete(id, { useFindAndModify: false }).then((data) => {
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

module.exports.update = async (req, res) => {
	try {
		const id = req.params.id;
		Queue.findByIdAndUpdate(id, req.body, { useFindAndModify: false, }).then((data) => {
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

module.exports.getByNumberAndDate = async (req, res) => {
    const { queue_number, queue_date } = req.body;

    if (!queue_number || !queue_date) {
        return res.status(400).send({ status: false, message: "Missing queue_number or queue_date" });
    }

    try {
        const queue = await Queue.findOne({ queue_number, queue_date });

        if (!queue) {
            return res.status(404).send({ status: false, message: "ไม่พบข้อมูล" });
        }

        return res.status(200).send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: queue });
    } catch (error) {
        console.error("Error fetching queue data:", error);
        return res.status(500).send({ status: false, message: "มีบางอย่างผิดพลาด", error: "server side error" });
    }
};

