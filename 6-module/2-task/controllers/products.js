const Product = require('../models/Product');
const mongoose = require('mongoose');
module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {

  if (!('subcategory' in ctx.query)) {
    ctx.body = {};

    return next();
  }

  try {
    const productBySubCat = await Product.find({subcategory: ctx.query.subcategory});
    ctx.body = {
      products: productBySubCat
        .map(({
          _id,
          title,
          images,
          category,
          subcategory,
          price,
          description,
        }) => ({
          id: _id,
          title,
          images,
          category,
          subcategory,
          price,
          description,
        })),
    };
  } catch (e) {
    if (e instanceof mongoose.CastError) {
      ctx.body = {
        products: [],
      };
    }
  }
};

module.exports.productList = async function productList(ctx, next) {

  const products = await Product.find();

  ctx.body = {
    products: products.map((item) => ({
      id: item._id,
      ...item,
    })),
  };
};

module.exports.productById = async function productById(ctx, next) {

  try {
    const product = await Product.findById(ctx.params.id);
    ctx.body = {
      product: {...product, id: product._id},
    };

  } catch (e) {
    if (e instanceof mongoose.CastError) {
      ctx.throw(400);
    } else {
      ctx.throw(404);
    }
  }
};

