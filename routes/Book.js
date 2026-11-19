const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

const bookCtrl = require("../controllers/Book")

router.post("/", auth, multer, bookCtrl.createBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.get("/:id", auth, bookCtrl.getOneBook);
router.get("/", auth, bookCtrl.allBooks);

module.exports = router;