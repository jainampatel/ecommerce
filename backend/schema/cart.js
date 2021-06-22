const mongoose = require("mongoose");
const Product = require("./product");
const User = require("./user");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: User },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: Product },
      name: { type: String, required: true },
      image: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  subtotal: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cart", cartSchema);
