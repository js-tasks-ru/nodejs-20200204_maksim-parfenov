const ProductModel = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.query.query;
  try {
    const products = await ProductModel.find(
      {$text: {$search: query}},
      {score: {$meta: 'textScore'}},
    ).sort({score: {$meta: 'textScore'}});

    if (!products) return next();

    ctx.body = {
      products: products.map((item) => ({
        id: item._id,
        title: item.title,
        images: item.images,
        category: item.category,
        subcategory: item.subcategory,
        price: item.price,
        description: item.description,
      })),
    };
  } catch (err) {
    ctx.body = {products: []};
  }
};
