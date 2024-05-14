const router = require("express").Router();
const QueueRoutes = require("../../controllers/antiques/queue.controller");

const authAdmin = require("../../lib/auth.admin");
const auth = require("../../lib/auth");

router.post("/", auth, QueueRoutes.create);

router.get("/", QueueRoutes.getAll);

router.get("/:id", QueueRoutes.getById);

router.delete("/:id", auth, QueueRoutes.delete);

router.put("/:id", auth, QueueRoutes.update);

module.exports = router;
