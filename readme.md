# teason - it's teason then

`teason` is a cli that takes **T**ypeScript definitions and generates both J**SON** schema and JSON mock data.

~~Some might call it a **TSON** generator~~

## Examples

Take a look at the examples to understand what `teason` does

Examples can be found in [the /examples directory](/examples)

## How to use

`npm i teason`

After installing you will be able to run the command `npx teason --help`

### cli options

Teason requires two things to run

1. Folder path where the TypeScript definitions can be found
2. The interface name to use

> Not defining `output-paths` will result in no output (a dry-run)

Full options:

```bash
Options:
  -t, --types-folder <folder>           folder path with typescript types
  -i, --interface-name <name>           main interface to begin with
  -j, --json-output-path <file_path>    output file to store the generated JSON
  -s, --schema-output-path <file_path>  output file to store the generated Schema
  -h, --help                            output usage information
```

## Schema

The schema output can be used to validate or create new JSON data.

[validation with ajv](https://github.com/epoberezkin/ajv) and/or
[creating with json-editor github](https://json-editor.github.io/json-editor/)

## Mock data

Mock data that conforms to your schema. Can be extended with `@faker` annotations to create more realistic data

Uses [typescript-json-schema](https://github.com/YousefED/typescript-json-schema), [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker/) and [faker.js](https://marak.github.io/faker.js/) under the hood.

### json-server

The output from `teason` is not optimized for [json-server](https://github.com/typicode/json-server), but it can be done quite easily.

The quickest way is to use [normalizr](https://github.com/paularmstrong/normalizr) and define a [`normalizr.schema`](https://github.com/paularmstrong/normalizr/blob/master/docs/api.md#schema) (not to be confused with a json schema).

[/examples/post-process.ts](/examples/post-process.ts) contains what you need. In most cases you will only have to change the result of `getDbSchema()` to get the script working for you
