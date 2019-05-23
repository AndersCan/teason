# Example

## Running

Running `npx teason -j out.json -s out.schema.json -t types/ -i Database`

Will generate `out.json` and `out.schema.json` found in this directory.

## json-server

Running `post-process.ts` will create `out.json-server.json` that can be used with json-server
Test it with `npm i json-server && npx json-server examples/out.json-server.json`
