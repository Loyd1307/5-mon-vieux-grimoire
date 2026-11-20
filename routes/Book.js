const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

const bookCtrl = require("../controllers/Book")

router.post("/", auth, multer, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);
router.get("/bestrating", bookCtrl.bestRateBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.get("/:id", bookCtrl.getOneBook);
router.get("/", bookCtrl.allBooks);

module.exports = router;