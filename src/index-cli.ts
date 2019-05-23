#!/usr/bin/env node

import Debug from 'debug';
import { writeFile } from 'fs';
import { generateDatabase } from './generate-database';
import { normalize } from 'normalizr';

import program from 'commander';
import { resolve } from 'path';

enum Type {
  JSON = 'json',
  SCHEMA = 'schema'
}

function parseType(input: unknown): Type {
  switch (input) {
    case Type.JSON: {
      return Type.JSON;
    }
    case Type.SCHEMA: {
      return Type.SCHEMA;
    }
    default: {
      return Type.JSON;
    }
  }
}

program
  .description(
    'Creates a JSON schema from the given TypeScript interfaces. Can also generate mock data using faker.js'
  )
  .option(
    '-J, --json-output <file_path>',
    'output file to store the generated JSON'
  )
  .option(
    '-S, --schema-output <file_path>',
    'output file to store the generated JSON'
  )
  .option(
    '-i, --interface-name <name>',
    'main interface to begin with',
    'database'
  )
  .option('-t, --types-folder <folder>', 'folder path with typescript types')
  .option('-s, --schema-script <script_location>', '')
  .option(
    '-n, --no-normalized',
    'only valid with --schemaScript. JSON output will be kept normalized'
  );

program.parse(process.argv);

const debug = Debug('teason-server:cli');
debug(program.opts());
// todo: accept database file name.
// typescript type folders
// accept flag for watch mode
// return schema?
// allow to extend 'json-schema-faker'

main();
async function main() {
  const {
    interfaceName,
    typesFolder,
    schemaScript,
    jsonOutput,
    schemaOutput,
    normalized
  } = program;

  debug('building', typesFolder, interfaceName);

  const { json, schema: skjema } = await generateDatabase(
    typesFolder,
    interfaceName
  );

  writeJsonToFile(schemaOutput, skjema);

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

    return writeJsonToFile(jsonOutput, jsonServerFormated);
  }

  // if no normalzing
  debug(`skipping normalizing json`);

  debug('writing to file');

  writeJsonToFile(jsonOutput, json);
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
