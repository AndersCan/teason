import Debug from 'debug';
import { writeFile } from 'fs';
import { generateDatabase } from './generate-database';
import { normalize, schema } from 'normalizr';

const debug = Debug('teason-server:cli');

// todo: accept database file name.
// typescript type folders
// accept flag for watch mode
// return schema?
// allow to extend 'json-schema-faker'
async function main() {
  debug('building');
  const { json, schema: skjema } = await generateDatabase();
  debug('writing to file');

  // Define a users schema
  const product = new schema.Entity('products');

  // Define your comments schema
  const category = new schema.Entity('categories', {
    products: [product]
  });

  // Define your article
  const database = new schema.Entity('categories', {
    categories: [category]
  });

  const normalizedData = normalize(json, database);

  writeFile('./db.json', JSON.stringify(json, null, 2), (err) => {
    if (err) {
      console.log('erroronio!');
    } else {
      console.log('success!');
    }
  });

  const jsonServerFormated = normalizedData.entities;
  for (let prop in jsonServerFormated) {
    console.log(prop);
    jsonServerFormated[prop] = Object.values(jsonServerFormated[prop]);
  }
  writeFile(
    './db-normalize.json',
    JSON.stringify(jsonServerFormated, null, 2),
    (err) => {
      if (err) {
        console.log('erroronio!');
      } else {
        console.log('success!');
      }
    }
  );
  writeFile('./db-skjema.json', JSON.stringify(skjema, null, 2), (err) => {
    if (err) {
      console.log('erroronio!');
    } else {
      console.log('success!');
    }
  });
}
main();
