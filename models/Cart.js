const mongoose = require("mongoose");

const CartScheme = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        img: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        }
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartScheme);
