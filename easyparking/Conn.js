const IgniteClient = require('apache-ignite-client');
const IgniteClientConfiguration = IgniteClient.IgniteClientConfiguration;

const igniteClient = new IgniteClient();

async function IgniteConnection() {
  try {
    const igniteClientConfiguration = new IgniteClientConfiguration(
      '127.0.0.1:10800', '127.0.0.1:10801', '127.0.0.1:10802');

    await igniteClient.connect(igniteClientConfiguration);
    return igniteClient;
  } catch (e) {
    console.error(e);
    return;
  }
}
IgniteConnection();

module.exports = igniteClient;
