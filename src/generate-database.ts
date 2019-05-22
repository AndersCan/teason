import Debug from 'debug';
import { getSchema } from './ts-to-js';
import { getJsonOf } from './schema-to-json';
// Declare a route

const debug = Debug('teason-server:generateDatabase');

export async function generateDatabase() {
  const interfaceName = capitalize('database');
  debug(`generating schema from interface ${interfaceName}`);
  const schema = getSchema(interfaceName);

  const json = await getJsonOf(schema);

  return { json, schema };
}

function capitalize(str: string) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}
