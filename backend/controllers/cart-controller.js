const Cart = require("../schema/cart");
const User = require("../schema/user");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Product = require("../schema/product");

const getCartByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let cart;

  try {
    cart = await Cart.findOne({ userId: userId });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  if (!cart) {
    return next(
      new HttpError("Could not find the cart for the provided user id.", 404)
    );
  }

  res.json({ cart: cart.toObject({ getters: true }) });
};

const createCart = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty) {
    return next(
      new HttpError("Invalid input passed, please check your data", 422)
    );
  }

  const { userId, productId, qty } = req.body;

  let hasUser;

  try {
    hasUser = await User.findById(userId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  if (!hasUser) {
    return next(
      new HttpError("Could not find the user for the provided id.", 404)
    );
  }

  let productData;

  try {
    productData = await Product.findById(productId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  if (!productData) {
    return next(
      new HttpError("Could not find the product for the provided id.", 404)
    );
  }

  const productName = productData.name;
  const productImage = productData.image;
  const productPrice = productData.price;

  let cart;
  try {
    cart = await Cart.findOne({ userId: userId });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find cart.", 500)
    );
  }
  if (cart) {
    let foundIndex = cart.products.findIndex((p) => p.productId == productId);

    if (foundIndex !== -1) {
      const updatedProduct = cart.products[foundIndex];

      updatedProduct.qty = updatedProduct.qty + qty;
      cart.products[foundIndex] = updatedProduct;
    } else {
      cart.products.push({
        productId,
        qty,
        name: productName,
        image: productImage,
        price: productPrice,
      });
    }

    let updatedSubtotal = productPrice * qty;
    cart.subtotal = cart.subtotal + updatedSubtotal;

    try {
      await cart.save();
    } catch (err) {
      return next(
        new HttpError("Something went wrong, could not save cart.", 500)
      );
    }

    return res.json({ cart: cart.toObject({ getters: true }) }).status(201);
  } else {
    const newCart = new Cart({
      userId,
      products: [
        {
          productId,
          name: productName,
          qty,
          image: productImage,
          price: productPrice,
        },
      ],
      subtotal: productPrice * qty,
    });
    try {
      await newCart.save();
    } catch (error) {
      return next(
        new HttpError("Something went wrong, please try again later.", 500)
      );
    }
    return res.json({ cart: newCart.toObject({ getters: true }) }).status(201);
  }
};

const updateCartProductQtyPlus = async (req, res, next) => {
  const productId = req.params.pid;
  const { userId } = req.body;
  let cart, product;

  try {
    cart = await Cart.findOne({ userId });
    product = await Product.findById(productId);
  } catch (error) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  if (!cart) {
    return next(
      new HttpError("Could not find cart for the provided user id.", 404)
    );
  }

  const foundIndex = cart.products.findIndex((p) => p.productId == productId);

  if (foundIndex == -1) {
    return next(
      new HttpError("Could not find product in cart for provided id.", 404)
    );
  }

  cart.products[foundIndex].qty = cart.products[foundIndex].qty + 1;

  if (cart.products[foundIndex].qty > product.quantity) {
    return next(new HttpError("Product is out of stock.", 404));
  }

  let updatedSubtotal = cart.products.map((p) => p.qty * p.price);

  cart.subtotal = updatedSubtotal.reduce((a, b) => a + b, 0);

  try {
    await cart.save();
  } catch (error) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  res.json({ cart: cart.toObject({ getters: true }) }).status(200);
};

const updateCartProductQtyMinus = async (req, res, next) => {
  const productId = req.params.pid;
  const { userId } = req.body;
  let cart;

  try {
    cart = await Cart.findOne({ userId });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  if (!cart) {
    return next(
      new HttpError("Could not find cart for the provided user id.", 404)
    );
  }

  const foundIndex = cart.products.findIndex((p) => p.productId == productId);

  if (foundIndex == -1) {
    return next(
      new HttpError("Could not find product in cart for provided id.", 404)
    );
  }

  cart.products[foundIndex].qty = cart.products[foundIndex].qty - 1;

  let newProducts;

  if (cart.products[foundIndex].qty < 1) {
    newProducts = cart.products.filter((p) => p.productId != productId);
    cart.products = newProducts;
  }

  let updatedSubtotal = cart.products.map((p) => p.qty * p.price);
  cart.subtotal = updatedSubtotal.reduce((a, b) => a + b, 0);

  try {
    await cart.save();
  } catch (error) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  res.json({ cart: cart.toObject({ getters: true }) }).status(200);
};

const deleteProductFromCart = async (req, res, next) => {
  const productId = req.params.pid;
  const { userId } = req.body;
  let cart;

  try {
    cart = await Cart.findOne({ userId });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  const foundIndex = cart.products.findIndex((p) => p.productId == productId);

  if (foundIndex == -1) {
    return next(
      new HttpError("Could not find product in cart for provided id.", 404)
    );
  }

  let newProducts = cart.products.filter((p) => p.productId != productId);
  cart.products = newProducts;

  let updatedSubtotal = cart.products.map((p) => p.qty * p.price);
  cart.subtotal = updatedSubtotal.reduce((a, b) => a + b, 0);

  try {
    await cart.save();
  } catch (error) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  res.json({ cart: cart.toObject({ getters: true }) }).status(200);
};

const deleteCart = async (req, res, next) => {
  const userId = req.params.uid;
  let cart;
  try {
    cart = await Cart.findOne({ userId });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, please try again later.", 500)
    );
  }

  if (!cart) {
    return next(
      new HttpError("Could not find cart for the provided user id.", 404)
    );
  }

  try {
    await Cart.deleteOne({ userId: userId });
  } catch (error) {
    return next(
      new HttpError("Something went wrong, could not delete cart.", 500)
    );
  }

  res.json({ message: "Cart Deleted." }).status(200);
};

exports.getCartByUserId = getCartByUserId;
exports.createCart = createCart;
exports.updateCartProductQtyPlus = updateCartProductQtyPlus;
exports.updateCartProductQtyMinus = updateCartProductQtyMinus;
exports.deleteProductFromCart = deleteProductFromCart;
exports.deleteCart = deleteCart;
