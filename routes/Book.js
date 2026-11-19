const express = require('express');
const router = express.Router();
const auth = require("auth");

const bookCtrl = require("../controllers/Book")

router.post("/", auth, bookCtrl.createBook);
router.put("/:id", auth, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.get("/:id", auth, bookCtrl.getOneBook);
router.get("/", auth, bookCtrl.allBooks);

module.exports = router;