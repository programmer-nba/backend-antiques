const router = require("express").Router();
const QueueRoutes = require("../../controllers/antiques/queue.controller");

const authAdmin = require("../../lib/auth.admin");
const auth = require("../../lib/auth");

router.post("/", auth, QueueRoutes.create);

router.get("/", QueueRoutes.getAll);

router.get("/byid/:id", QueueRoutes.getById);

router.get("/bynum", auth, QueueRoutes.getByNumberAndDate);

router.delete("/:id", auth, QueueRoutes.delete);

router.put("/:id", auth, QueueRoutes.update);

router.put("/pay/:id", auth, QueueRoutes.pay);


module.exports = router;
