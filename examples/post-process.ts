import { writeFileSync, readFileSync } from 'fs';
import { normalize, schema } from 'normalizr';
import { resolve } from 'path';

const input = resolve('examples', './out.json');
const output = resolve('examples', './out.json-server.json');

main();

function getDbSchema() {
  const product = new schema.Entity('products');

  const category = new schema.Entity('categories', {
    products: [product]
  });

  const mySchema = {
    categories: [category]
  };

  return mySchema;
}

function deNormalize(json: any) {
  const res: any = {};
  for (let prop in json) {
    res[prop] = Object.values(json[prop]);
  }
  return res;
}

function main() {
  const json = JSON.parse(readFileSync(input).toString('utf8'));
  const dbSchema = getDbSchema();
  const normalizedData = normalize(json, dbSchema);

  const jsonServerFormated = normalizedData.entities;
  const deNormalized = deNormalize(jsonServerFormated);
  writeFileSync(output, JSON.stringify(deNormalized, null, 2));
}
