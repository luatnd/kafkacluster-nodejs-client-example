const { Kafka, Partitioners } = require('kafkajs')
const fs = require('fs')
const jks = require('jks-js');


const keystoreFile = 'secrets/kafka.keystore.jks';
const keystorePw = '4g38nyAJ';
const keystore = jks.toPem(fs.readFileSync(keystoreFile), keystorePw);
// console.log('keystore: ', keystore);

const host = 'localhost';
const { cert, key } = keystore[host];
const ca = keystore.caroot.ca;

// console.log('cert: ', cert);
// console.log('key: ', key);



// Create the client with the broker list
const kafka = new Kafka({
  clientId: 'nft-metadata-service',
  brokers: ['kafka-83477-0.cloudclusters.net:11939'],

  // authenticationTimeout: 10000,
  // reauthenticationThreshold: 10000,

  ssl: {
    rejectUnauthorized: true,
    ca: [ca],
    key: key,
    cert: cert,
    passphrase: keystorePw,
  },

  // ssl: true,
  sasl: {
    mechanism: 'scram-sha-256', // scram-sha-256 or scram-sha-512
    username: 'scanner',
    password: 'scanner123'
  },
})


const producer = kafka.producer({
    allowAutoTopicCreation: true,
    transactionTimeout: 20000,
    // createPartitioner: Partitioners.LegacyPartitioner,
})

let msgs = []
let msgs_2 = [
    { key: 'key1', value: 'hello world ' + new Date() },
    { key: 'key2', value: 'hey hey!' + new Date() },
]

for (var i = 100; i >= 0; i--) {
	msgs = msgs.concat(msgs_2)
}

producer.connect().then(() => {
	console.log("Producer connected\n");

	setInterval(async () => {
		const result = await producer.send({
		    topic: 'topic-test',
		    messages: msgs,
		})

		console.log("Sen to topic topic-test: result: ", result, new Date())
	}, 500)
});



setInterval(function() {
    console.log("timer that keeps nodejs processing running");
}, 1000 * 60 * 60);
