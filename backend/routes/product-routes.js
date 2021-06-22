const express = require("express");
const { check } = require("express-validator");

const productController = require("../controllers/product-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("details").not().isEmpty(),
    check("quantity").not().isEmpty().isNumeric(),
    check("price").not().isEmpty().isNumeric(),
  ],
  productController.createProduct
);

module.exports = router;
