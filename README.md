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

Your application should now be ready to rock.

## Usage

Once installed, run the application with:

```sh
npm run start:dapr
```

To shut down the application, hit `ctrl-c`.

## Environment Variables

### CNS Dapr

<table>
  <tr><th>Name</th><th>Description</th><th>Default</th></tr>
  <tr><td>CNS_SERVER_HOST</td><td>CNS Dapr server host</td><td>'localhost'</td></tr>
  <tr><td>CNS_SERVER_PORT</td><td>CNS Dapr server port</td><td>'3000'</td></tr>
  <tr><td>CNS_DAPR_HOST</td><td>Dapr host</td><td>'localhost'</td></tr>
  <tr><td>CNS_DAPR_PORT</td><td>Dapr port</td><td>'3500'</td></tr>
  <tr><td>CNS_PUBSUB</td><td>CNS Dapr PUBSUB component ID</td><td>'cns-pubsub'</td></tr>
  <tr><td>CNS_BROKER</td><td>CNS Dapr broker module</td><td>'padi'</td></tr>
</table>

### Padi Broker

<table>
  <tr><th>Name</th><th>Description</th><th>Default</th></tr>
  <tr><td>CNS_PADI_CP</td><td>Padi Broker server URI</td><td>'https://cp.staging.padi.io'</td></tr>
  <tr><td>CNS_PADI_API</td><td>Padi API server URI</td><td>'https://api.staging.padi.io'</td></tr>
  <tr><td>CNS_PADI_MQTT</td><td>Padi MQTT server URI</td><td>'wss://cns.staging.padi.io:1881'</td></tr>
  <tr><td>CNS_PADI_THING</td><td>Padi thing ID</td><td>Must be set</td></tr>
  <tr><td>CNS_PADI_TOKEN</td><td>Padi thing access token</td><td>Must be set</td></tr>
</table>

## License

See [LICENSE.md](./LICENSE.md).

## Copyright Notice

See [COPYRIGHT.md](./COPYRIGHT.md).
