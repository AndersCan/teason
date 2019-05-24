import Debug from 'debug';
import { getSchema } from './ts-to-json-schema';
import { getJsonOf } from './schema-to-json';
import { readdirSync } from 'fs';
import { resolve } from 'path';
import { Definition } from 'typescript-json-schema';
// Declare a route

const debug = Debug('teason:generateDatabase');

const EXTENSIONS_RE = /.*.(ts|tsx)$/;

export async function generateDatabase(
  typeFolderPath: string,
  interfaceName: string,
  validationKeywords: string[]
): Promise<{ json: any; schema: Definition }> {
  debug(`generating schema from interface ${interfaceName}`);

  const inputFiles = readdirSync(resolve(typeFolderPath))
    .filter((filename) => EXTENSIONS_RE.test(filename))
    .map((filename) => resolve(typeFolderPath, filename));

  debug(`filtering for ${EXTENSIONS_RE}`);
  debug(`TS files found: \n${inputFiles.join('\n')}`);

  const schema = getSchema(inputFiles, interfaceName, validationKeywords);

  const json = await getJsonOf(schema);

  return { json, schema };
}
