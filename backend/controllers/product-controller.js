const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Product = require("../schema/product");

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find();
  } catch (error) {
    return next(
      new HttpError("Could not find products, something went wrong.", 500)
    );
  }

  if (!products || products.length === 0) {
    return next(new HttpError("Could not find products.", 404));
  }

  res
    .json({ products: products.map((p) => p.toObject({ getters: true })) })
    .status(200);
};

const getProductById = async (req, res, next) => {
  let product;
  try {
    product = await Product.findById(req.params.pid);
  } catch (error) {
    return next(
      new HttpError("Could not find product, something went wrong.", 500)
    );
  }

  if (!product) {
    return next(
      new HttpError("Could not find product for the provided id.", 404)
    );
  }
  res.json({ product: product.toObject({ getters: true }) }).status(200);
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input passed, please check your data", 422)
    );
  }

  const { name, details, quantity, price } = req.body;

  const createdProduct = new Product({
    name,
    details,
    image: req.file.path,
    quantity,
    price,
  });

  try {
    await createdProduct.save();
  } catch (err) {
    return next(
      new HttpError("Could not create product, something went wrong.", 500)
    );
  }

  res.json({ product: createdProduct }).status(201);
};

exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
