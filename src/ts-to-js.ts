import Debug from 'debug';

import * as TJS from 'typescript-json-schema';
const debug = Debug('teason:ts-to-js');

// optionally pass argument to schema generator

// optionally pass ts compiler options
const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true
};

export function getSchema(
  inputFiles: string[],
  interfaceName: string,
  validationKeywords: string[]
) {
  const program = TJS.getProgramFromFiles(inputFiles, compilerOptions);
  const settings: TJS.PartialArgs = {
    required: true,
    validationKeywords
  };
  const generator = TJS.buildGenerator(program, settings);
  if (generator) {
    const schema = generator.getSchemaForSymbol(interfaceName);
    debug('created schema');

    return schema;
  }
  debug('failed to create generator');
  return {};
}
