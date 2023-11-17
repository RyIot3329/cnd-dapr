# CNS-Dapr

## Table of Contents

- [About](#about)
- [Installing](#installing)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [License](#license)
- [Copyright Notice](#copyright-notice)

## About

## Installing

To **install** or **update** the application, you should fetch the latest version from this Git repository. To do that, you may either download and unpack the repo zip file, or clone the repo using:

```sh
git clone https://github.com/cnscp/cns-dapr.git
```

Either method should get you a copy of the latest version. It is recommended (but not compulsory) to place the repo in the `~/cns-dapr` project directory. Go to the project directory and install Node.js dependancies with:

```sh
npm install
```

Now install the Dapr docker image with:

```sh
dapr init
```

Your application should now be ready to rock.

## Usage

Once installed, run the application with:

```sh
npm run start:dapr
```

To shut down the application, hit `ctrl-c`.

### Environment Variables

The application uses the following environment variables to configure itself:

#### CNS Dapr

<table>
  <tr><th>Name</th><th>Description</th><th>Default</th></tr>
  <tr><td>CNS_SERVER_HOST</td><td>CNS Dapr server host</td><td>'localhost'</td></tr>
  <tr><td>CNS_SERVER_PORT</td><td>CNS Dapr server port</td><td>'3000'</td></tr>
  <tr><td>CNS_DAPR_HOST</td><td>Dapr host</td><td>'localhost'</td></tr>
  <tr><td>CNS_DAPR_PORT</td><td>Dapr port</td><td>'3500'</td></tr>
  <tr><td>CNS_PUBSUB</td><td>CNS Dapr PUBSUB component ID</td><td>'cns-pubsub'</td></tr>
  <tr><td>CNS_BROKER</td><td>CNS Dapr broker module</td><td>'padi'</td></tr>
</table>

#### Padi Broker

<table>
  <tr><th>Name</th><th>Description</th><th>Default</th></tr>
  <tr><td>CNS_PADI_CP</td><td>Padi Broker server URI</td><td>'https://cp.staging.padi.io'</td></tr>
  <tr><td>CNS_PADI_API</td><td>Padi API server URI</td><td>'https://api.staging.padi.io'</td></tr>
  <tr><td>CNS_PADI_MQTT</td><td>Padi MQTT server URI</td><td>'wss://cns.staging.padi.io:1881'</td></tr>
  <tr><td>CNS_PADI_THING</td><td>Padi thing ID</td><td>Must be set</td></tr>
  <tr><td>CNS_PADI_TOKEN</td><td>Padi thing access token</td><td>Must be set</td></tr>
</table>

### Invocation API Reference

Dapr provides the ability to call other applications that use Dapr with a unique named identifier. The identifier for the CNS Dapr app is `cns-dapr`. The following HTTP endpoint lets you invoke a method on the CNS Dapr app:

`GET|POST|PUT|DELETE http://localhost:<daprPort>/v1.0/invoke/cns-dapr/method/<method>`

Where the HTTP method will:

<table>
  <tr><th>HTTP Method</th><th>Description</th></tr>
  <tr><td>GET</td><td>Read data from the endpoint</td></tr>
  <tr><td>POST</td><td>Write data to the endpoint</td></tr>
  <tr><td>PUT</td><td>NYI</td></tr>
  <tr><td>DELETE</td><td>NYI</td></tr>
</table>

CNS Dapr exposes the following endpoint methods:

<table>
  <tr><th>Invoke Method</th><th>Description</th></tr>
  <tr><td>node</td><td>All node metadata and connections</td></tr>
  <tr><td>node/&lt;meta&gt;</td><td>A specific node metadata field</td></tr>
  <tr><td>node/connections</td><td>All connections</td></tr>
  <tr><td>node/connections/&lt;id&gt;</td><td>A specific connection</td></tr>
  <tr><td>node/connections/&lt;id&gt;/&lt;meta&gt;</td><td>A specific connection metadata field</td></tr>
  <tr><td>node/connections/&lt;id&gt;/properties</td><td>All properties of a connection</td></tr>
  <tr><td>node/connections/&lt;id&gt;/properties/&lt;name&gt;</td><td>A specific property value</td></tr>
  <tr><td>profiles/&lt;name&gt;</td><td>A named profile deffinition</td></tr>
</table>

After making a request, Dapr returns one of the following status codes:

<table>
  <tr><th>HTTP Status</th><th>Description</th></tr>
  <tr><td>200</td><td>Request succeded</td></tr>
  <tr><td>400</td><td>Method name not given</td></tr>
  <tr><td>403</td><td>Invocation forbidden by access control</td></tr>
  <tr><td>500</td><td>Request failed</td></tr>
</table>

All HTTP requests/responses use JSON and the `application/json` mime type.

A successful GET request will return:

`{"data": { ... }}`

A successfull POST, PUT or DELETE request will return:

`{"data": "ok"}`

If CNS Dapr encounters an error, it will return:

`{"error": "bad request"}`

#### Examples

The following examples use `curl` in a terminal window:

---

```sh
curl http://localhost:3500/v1.0/invoke/cns-dapr/method/node
```

Requests full node metadata and connections and will output:

`{"data": { ... }}`

with the full JSON description of the node (See: Node Schema).

---

```sh
curl http://localhost:3500/v1.0/invoke/cns-dapr/method/node/comment
```

Requests a specific node metadata field and will output:

`{"data": "Testing"}`

with the current value of the specified field.

---

```sh
curl http://localhost:3500/v1.0/invoke/cns-dapr/method/node/garbage
```

Requests a field that does not exist and outputs:

`{"error": "bad request"}`

since **garbage** is not a valid field name.

---

```sh
curl http://localhost:3500/v1.0/invoke/cns-dapr/method/node \
    -H "Content-Type: application/json" \
    -d '{"comment": "Testing 1"}'
```

output: {"data": "ok"}

---

```sh
curl http://localhost:3500/v1.0/invoke/cns-dapr/method/node/comment \
    -H "Content-Type: application/json" \
    -d '"Testing 2"'
```

output: {"data": "ok"}

---

```sh
curl http://localhost:3500/v1.0/invoke/cns-dapr/method/node/comment
```

output: {"data":"Test2"}


---

```sh
curl http://localhost:3500/v1.0/invoke/cns-dapr/method/profiles/test.abc
```

Will request the descriptor for the profile `test.abc` and outputs:

`{"data": { ... }}`

with the full descriptor for the profile (See: Profile Schema).

---

### Pub/Sub API Reference

CNS Dapr publishes to the following topics:

<table>
  <tr><th>Topic Name</th><th>Description</th></tr>
  <tr><td>node</td><td>All node metadata and connection changes</td></tr>
</table>

Dapr will invoke the following endpoint of an application to discover topic subscriptions:

`GET http://localhost:<appPort>/dapr/subscribe`

The application should return a JSON block containing the topics it wishes to subscribe to:

```sh
[
  {
    "pubsubname": "cns-pubsub",
    "topic": "node",
    "route": "/node"
  }
]
```

To deliver topic messages, a HTTP `POST` will be made to the application at the route specified in the subscribe response. A HTTP 200 status response denotes successful processing of message.

#### Examples





### Dapr SDK



### Node Schema

<table>
  <tr><th>Property</th><th>Description</th></tr>
  <tr><td>name</td><td>Name of this node</td></tr>
  <tr><td>title</td><td>Title of this node</td></tr>
  <tr><td>comment</td><td>Comment of this node</td></tr>
  <tr><td>connections</td><td>Connections of this node</td></tr>
</table>

<table>
  <tr><th>Property</th><th>Description</th></tr>
  <tr><td>profile</td><td>Profile of this connection</td></tr>
  <tr><td>version</td><td>Profile version of this connection</td></tr>
  <tr><td>role</td><td>Role of this connection</td></tr>
  <tr><td>client</td><td>Client name of this connection</td></tr>
  <tr><td>server</td><td>Server name of this connection</td></tr>
  <tr><td>status</td><td>Status of this connection</td></tr>
  <tr><td>properties</td><td>Properties of this connection</td></tr>
</table>

#### Example

```sh
{
  "name": "Example Server",
  "title": "An example server",
  "comment": "This is only an example",
  "connections":
    {
      "wXStyS6Dvju5AMdz0mC6":
        {
          "profile": "test.abc",
          "version": "",
          "role": "server",
          "client": "Example Client",
          "server": "Example Server",
          "status": "new",
          "properties":
            {
              "foo1": 100,
              "foo2": 200,
              "far1": 101,
              "far2": 201
            }
        }
    },
    ...
}
```

### Profile Schema

<table>
  <tr><th>Property</th><th>Description</th></tr>
  <tr><td>name</td><td></td></tr>
  <tr><td>title</td><td></td></tr>
  <tr><td>comment</td><td></td></tr>
  <tr><td>versions</td><td></td></tr>
</table>

<table>
  <tr><th>Property</th><th>Description</th></tr>
  <tr><td>name</td><td></td></tr>
  <tr><td>description</td><td></td></tr>
  <tr><td>server</td><td></td></tr>
  <tr><td>propagate</td><td></td></tr>
  <tr><td>required</td><td></td></tr>
</table>

#### Example

```sh
{
  "name": "test.abc",
  "title": "Simple demo Connection Profile",
  "comment": "Used to explain CNS/CP",
  "versions": [
    {
      "properties": [
        {
          "name": "foo1",
          "description": "Foo 1 property",
          "propagate": null
        },
        {
          "name": "foo2",
          "description": "Foo 2 property",
          "propagate": null
        },
        {
          "name": "far1",
          "description": "Far 1 property",
          "server": null,
          "propagate": null
        },
        {
          "name": "far2",
          "description": "Far 2 property"
          "server": null,
          "propagate": null
        }
      ]
    }
  ]
}
```

## Maintainers

## License

See [LICENSE.md](./LICENSE.md).

## Copyright Notice

See [COPYRIGHT.md](./COPYRIGHT.md).
