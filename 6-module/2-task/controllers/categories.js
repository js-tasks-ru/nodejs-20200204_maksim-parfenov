const Category = require('../models/Category');


module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  const collection = categories.map((item) => ({
    title: item.title,
    id: item._id,
    subcategories: item.subcategories.map(({title, _id}) => ({
      title,
      id: _id,
    })),
  }));

  ctx.body = {categories: collection};
};
