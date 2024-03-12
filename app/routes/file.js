const express = require("express");
const path = require("path");
const router = express.Router();


router.get("/product/:filename", (req, res) => {
  res.sendFile(path.join(__dirname, "../../upload/product_image/"+req.params.filename));
});

router.get("/category/:filename", (req, res) => {
  res.sendFile(path.join(__dirname, "../../upload/category/"+req.params.filename));
});


module.exports = router;