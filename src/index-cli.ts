#!/usr/bin/env node

import Debug from 'debug';
import { writeFile } from 'fs';
import { generateDatabase } from './generate-database';
import { normalize } from 'normalizr';

import program from 'commander';
import { resolve } from 'path';

program
  .description(
    'Creates a JSON schema from the given TypeScript interfaces. Can also generate mock data using faker.js'
  )
  .option('-t, --types-folder <folder>', 'folder path with typescript types')
  .option(
    '-i, --interface-name <name>',
    'main interface to begin with',
    'database'
  )
  .option(
    '-J, --json-output-path <file_path>',
    'output file to store the generated JSON'
  )
  .option(
    '-S, --schema-output-path <file_path>',
    'output file to store the generated JSON'
  )
  .option('-s, --schema-script <script_location>', '')
  .option(
    '-n, --no-normalized',
    'only valid with --schemaScript. JSON output will be kept normalized'
  );

program.parse(process.argv);

const debug = Debug('teason:cli');
debug(program.opts());
/**
 * @todo
 * accept flag for watch mode
 * allow to extend 'json-schema-faker'
 */

main();
async function main() {
  const {
    interfaceName,
    typesFolder,
    schemaScript,
    jsonOutputPath,
    schemaOutputPath,
    normalized
  } = program;

  debug('building', typesFolder, interfaceName);

  const { json, schema: skjema } = await generateDatabase(
    typesFolder,
    interfaceName
  );

  writeJsonToFile(schemaOutputPath, skjema);

  if (schemaScript) {
    debug('reading schema from', schemaScript);

    const beforeSaveScript = await import(resolve(schemaScript));
    const schema = await beforeSaveScript.default.getSchema();
    debug('got schema from', schemaScript);

    const normalizedData = normalize(json, schema);

    const jsonServerFormated = normalizedData.entities;

    if (normalized) {
      debug(`normalizing json`);
      for (let prop in jsonServerFormated) {
        debug(`creating ${prop}`);
        jsonServerFormated[prop] = Object.values(jsonServerFormated[prop]);
      }
    }

    return writeJsonToFile(jsonOutputPath, jsonServerFormated);
  }

  // if no normalzing
  debug(`skipping normalizing json`);

  debug('writing to file');

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
