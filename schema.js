const { schema } = require('normalizr');

exports.getSchema = function() {
  const product = new schema.Entity('products');

  const category = new schema.Entity('categories', {
    products: [product]
  });

  const database = new schema.Entity('categories', {
    categories: [category]
  });

  return database;
};
