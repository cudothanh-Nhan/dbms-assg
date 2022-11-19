const IgniteClient = require('apache-ignite-client');
const IgniteClientConfiguration = IgniteClient.IgniteClientConfiguration;

const igniteClient = new IgniteClient();

async function IgniteConnection() {
    try {
        const igniteClientConfiguration = new IgniteClientConfiguration('53e22b07-8ae5-4b42-aefd-090d769ae8a2.gridgain-nebula.com:10800').
        setUserName('easyparking').
        setPassword('15N7ywWgwAm5UTa').
        setConnectionOptions(true);

        await igniteClient.connect(igniteClientConfiguration);
        return igniteClient
    } catch (e) {
        console.error
        return
    }
}
IgniteConnection()

module.exports = igniteClient
