import { resolve } from 'path';
import { readdirSync } from 'fs';
import Debug from 'debug';

import * as TJS from 'typescript-json-schema';
const debug = Debug('teason-server:generateDatabase');

const inputFiles = readdirSync(resolve('./types/')).map((filename) =>
  resolve(`./types/${filename}`)
);

debug(`TS files found: ${inputFiles.join('\n')}`);
// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
  validationKeywords: ['faker']
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true
};

const program = TJS.getProgramFromFiles(inputFiles, compilerOptions);
const generator = TJS.buildGenerator(program, settings);

export function getSchema(interfaceName: string) {
  if (generator) {
    const schema = generator.getSchemaForSymbol(interfaceName);
    return schema;
  }
  return {};
}
