# Example

## Running

Running `npx teason -j out.json -s out.schema.json -t types/ -i Database` will generate `out.json` and `out.schema.json` that are in this directory.

## json-server

Running `post-process.ts` will create `out.json-server.json` that can be used with json-server.

You can test it with `npm i json-server && npx json-server examples/out.json-server.json`
