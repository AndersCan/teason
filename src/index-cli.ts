#!/usr/bin/env node

import Debug from 'debug';
import { writeFile } from 'fs';
import { generateDatabase } from './generate-database';

import program from 'commander';

program
  .description(
    'Creates a JSON schema from the given TypeScript interfaces. Can also generate mock data using faker.js'
  )
  .option('-t, --types-folder <folder>', 'folder path with typescript types')
  .option('-i, --interface-name <name>', 'main interface to begin with')
  .option(
    '-j, --json-output-path <file_path>',
    'output file to store the generated JSON'
  )
  .option(
    '-s, --schema-output-path <file_path>',
    'output file to store the generated Schema'
  );

program.parse(process.argv);

const debug = Debug('teason:cli');
debug(program.opts());
/**
 * @todo
 * accept flag for watch mode
 * allow to extend 'json-schema-faker'
 * make cli import main fn and pass options
 */

main();
async function main() {
  const {
    interfaceName,
    typesFolder,
    jsonOutputPath,
    schemaOutputPath
  } = program;

  if (!interfaceName || !typesFolder) {
    console.error('invalid interfaceName or typesFolder given', {
      interfaceName,
      typesFolder
    });
    return;
  }

  if (!jsonOutputPath && !schemaOutputPath) {
    console.info('No output will be generated', {
      jsonOutputPath,
      schemaOutputPath
    });
  }

  debug('building', typesFolder, interfaceName);

  const { json, schema: skjema } = await generateDatabase(
    typesFolder,
    interfaceName
  );

  writeJsonToFile(schemaOutputPath, skjema);
  writeJsonToFile(jsonOutputPath, json);
}

function writeJsonToFile(filepath: unknown, data: object): void {
  if (typeof filepath === 'string') {
    return writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        debug('failed writing to:', filepath);
        console.error('failed writing to:', filepath);
      } else {
        debug('success writing to:', filepath);
      }
    });
  }
  debug('writeJsonToFile invalid filepath', filepath);
}
