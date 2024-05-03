# FlamingoDB

[![Node.js CI](https://github.com/Mohanterri/FlamingoDB/actions/workflows/node.js.yml/badge.svg)](https://github.com/Mohanterri/FlamingoDB/actions/workflows/node.js.yml)

> [!IMPORTANT]
> Viewing alpha v1 documentation – usable but expect breaking changes. For stable version, see [here](https://github.com/Mohanterri/FlamingoDB/tree/v0)

## Install

```shell
npm install flamingodb
```

## Usage

Create a `databases/db.json` or `databases/db.json5` file

```json
{
    "__collections__":[],
    "__documents__":[],
    "__datas__":[]
}
```

<details>

<summary>View db.json5 example</summary>

```json5
{
    __collections__: [],
    __documents__: [],
    __datas__: []
}
```

You can read more about JSON5 format [here](https://github.com/json5/json5).

</details>

Setup application

```nodejs
const flamingo = require('flamingodb');
const server = flamingo.server;

//run a local server
server.start_server('localhost', 3000, async (serve, host, port) => {
    webserver = serve;
    webserver.use(express.static(path.join(__dirname, 'views')));
    console.log(`Server it\'s started and listen, http://${host}:${port}`);
});

//start a public server
exec('curl ip-adresim.app', function(error, stdout, stderr){
    if(error){
        console.log("public server not started");
        return;
    }
    server.start_server(`${stdout}`, 6661, async (serve, host, port) => {});
});

```

## Routes

API calls are made automatically according to the following patterns:

```
GET    /:collection
GET    /:collection/:document
POST   /:collection
PUT    /:collection/:document
PATCH  /:collection/:document
DELETE /:collection/:document

# Same for comments
```

## Delete

```
DELETE /posts/1
DELETE /posts/1?_dependent=comments
```
