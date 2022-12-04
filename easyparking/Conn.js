const IgniteClient = require('apache-ignite-client');
const IgniteClientConfiguration = IgniteClient.IgniteClientConfiguration;

const igniteClient = new IgniteClient();

async function IgniteConnection() {
  try {
    const igniteClientConfiguration = new IgniteClientConfiguration(
      'e20ae279-d590-4d02-9357-46f7cadb7fc4.gridgain-nebula.com:10800'
    )
      .setUserName('bang')
      .setPassword('7UqhZOVtLc5M0AJ')
      .setConnectionOptions(true);

    await igniteClient.connect(igniteClientConfiguration);
    return igniteClient;
  } catch (e) {
    console.error;
    return;
  }
}
IgniteConnection();

module.exports = igniteClient;
