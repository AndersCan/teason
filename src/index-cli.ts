#!/usr/bin/env node

import Debug from 'debug';
import cosmiconfig from 'cosmiconfig';
import program from 'commander';
import { writeFile } from 'fs';

import { generateDatabase } from './generate-database';

const debug = Debug('teason:cli');

function parseKeywords(input: unknown): string[] {
  if (typeof input === 'string') {
    const split = input.split(',');
    debug('unable to parse keyword', input);
    return split;
  }
  debug('unable to parse keyword', input);
  return ['faker'];
}

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
  )
  .option(
    '-v, --validation-keywords <comma separated list>',
    'keywords of extra annotation to accept ex: "title,test,data" ',
    parseKeywords
  );

/**
 * @todo
 * accept flag for watch mode
 * allow to extend 'json-schema-faker'
 * make cli import main fn and pass options
 */

program.parse(process.argv);
const cliProps = program.opts();

// TODO
if (cliProps.validationKeywords === undefined) {
  delete cliProps.validationKeywords;
}
const defaultProps: Partial<TeasonProps> = {
  validationKeywords: ['faker']
};
const explorer = cosmiconfig('teason');
explorer
  .search()
  .then((config) => {
    if (config) {
      debug('using config file found at', config.filepath);
      return { ...defaultProps, ...config.config, ...cliProps };
    } else {
      debug('no config file found');
      return { ...defaultProps, ...cliProps };
    }
  })
  .then((props) => {
    debug('teason called with: ');
    debug(props);
    return (props as any) as TeasonProps;
  })
  .then(main)
  .catch((err) => console.log({ err }));

interface TeasonProps {
  interfaceName: string;
  typesFolder: string;
  jsonOutputPath?: string;
  schemaOutputPath?: string;
  validationKeywords: string[];
}
async function main(props: TeasonProps) {
  const {
    interfaceName,
    typesFolder,
    jsonOutputPath,
    schemaOutputPath,
    validationKeywords
  } = props;

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
    interfaceName,
    validationKeywords
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
