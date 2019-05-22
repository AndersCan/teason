#!/usr/bin/env node

import Debug from 'debug';
import { writeFile, readdirSync } from 'fs';
import { generateDatabase } from './generate-database';
import { normalize, schema } from 'normalizr';

import program from 'commander';
import { resolve } from 'path';

program
  .option(
    '-o, --output-file <file_path>',
    'output file to store the generated JSON'
  )
  .option(
    '-i, --interface-name <name>',
    'main interface to begin with',
    'database'
  )
  .option('-t, --types-folder <folder>', 'folder path with typescript types')
  .option('-s, --schemaScript <script_location>', 'script that returns schema')
  .option(
    '-n, --keepNormalized',
    'do not convert to array readable by json-server'
  );

program.parse(process.argv);

const debug = Debug('teason-server:cli');

// todo: accept database file name.
// typescript type folders
// accept flag for watch mode
// return schema?
// allow to extend 'json-schema-faker'
async function main() {
  const {
    interfaceName,
    typesFolder,
    schemaScript,
    outputFile,
    keepNormalized
  } = program;

  debug('building', typesFolder, interfaceName);

  const { json, schema: skjema } = await generateDatabase(
    typesFolder,
    interfaceName
  );

  if (schemaScript) {
    debug('reading schema from', schemaScript);

    const beforeSaveScript = await import(resolve(schemaScript));
    const schema = await beforeSaveScript.default.getSchema();
    debug('got schema from', schemaScript);

    const normalizedData = normalize(json, schema);

    const jsonServerFormated = normalizedData.entities;

    if (!keepNormalized) {
      debug(`normalizing json`);
      for (let prop in jsonServerFormated) {
        debug(`creating ${prop}`);
        jsonServerFormated[prop] = Object.values(jsonServerFormated[prop]);
      }
    }

    return writeFile(
      outputFile,
      JSON.stringify(normalizedData, null, 2),
      (err) => {
        if (err) {
          debug('erroronio!');
        } else {
          debug('success!');
        }
      }
    );
  }

  // if no normalzing
  debug(`skipping normalizing json`);

  debug('writing to file');

  writeFile(outputFile, JSON.stringify(json, null, 2), (err) => {
    if (err) {
      debug('erroronio!');
    } else {
      debug('success!');
    }
  });
}
main();
