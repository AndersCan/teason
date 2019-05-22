import { resolve } from 'path';
import { readdirSync } from 'fs';
import Debug from 'debug';

import * as TJS from 'typescript-json-schema';
const debug = Debug('teason-server:generateDatabase');

const inputFiles = readdirSync(resolve('./types/')).map((filename) =>
  resolve(`./types/${filename}`)
);

debug(`TS files found: ${inputFiles}`);
// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
  validationKeywords: ['faker']
};

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true
};

// optionally pass a base path
const basePath = './types'; // what is this?
// const basePath = './my-dir';

const program = TJS.getProgramFromFiles(inputFiles, compilerOptions, basePath);
const generator = TJS.buildGenerator(program, settings);

export function getSchema(interfaceName: string) {
  // We can either get the schema for one file and one type...
  // const schema = TJS.generateSchema(program, interfaceName, settings);

  // ... or a generator that lets us incrementally get more schemas

  if (generator) {
    // all symbols
    // const symbols = generator.getUserSymbols();
    // Get symbols for different types from generator.
    const schema = generator.getSchemaForSymbol(interfaceName);
    return schema;
  }
  return {};
}
// // ... or a generator that lets us incrementally get more schemas

// const generator = TJS.buildGenerator(program, settings);

// if (generator) {
//   // all symbols
//   const symbols = generator.getUserSymbols();

//   // Get symbols for different types from generator.
//   generator.getSchemaForSymbol('MyType');
//   generator.getSchemaForSymbol('AnotherType');
// }
