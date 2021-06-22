const express = require("express");
const { check } = require("express-validator");

const cartController = require("../controllers/cart-controller");

const router = express.Router();

router.get("/:uid", cartController.getCartByUserId);

router.post(
  "/",
  [
    check("userId").not().isEmpty(),
    check("productId").not().isEmpty(),
    check("qty").not().isEmpty().isNumeric({ min: 1 }),
  ],
  cartController.createCart
);

router.patch("/:pid", cartController.deleteProductFromCart);
router.patch("/updateQtyPlus/:pid", cartController.updateCartProductQtyPlus);
router.patch("/updateQtyMinus/:pid", cartController.updateCartProductQtyMinus);

router.delete("/:uid", cartController.deleteCart);

module.exports = router;
