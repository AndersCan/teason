import Debug from 'debug';
import { getSchema } from './ts-to-js';
import { getJsonOf } from './schema-to-json';
import { readdirSync } from 'fs';
import { resolve } from 'path';
// Declare a route

const debug = Debug('teason-server:generateDatabase');

export async function generateDatabase(
  typeFolderPath: string,
  inputInterfaceName: string
) {
  const interfaceName = capitalize(inputInterfaceName);

  debug(`generating schema from interface ${interfaceName}`);

  const inputFiles = readdirSync(resolve(typeFolderPath)).map((filename) =>
    resolve(`./${typeFolderPath}/${filename}`)
  );
  debug(`TS files found: \n${inputFiles.join('\n')}`);

  const schema = getSchema(inputFiles, interfaceName);

  const json = await getJsonOf(schema);

  return { json, schema };
}

function capitalize(str: string) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}
