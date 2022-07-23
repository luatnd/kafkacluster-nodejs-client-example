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
    createPartitioner: Partitioners.LegacyPartitioner,
})


const consumer = kafka.consumer({ 
	groupId: 'nft-metadata-service',
})
connectAndConsume()

async function connectAndConsume() {
	await consumer.connect()
	console.log("Consumer connected\n");

	await consumer.subscribe({ topics: ['topic-test'] })
	console.log('subscribed: ')

	// await consumer.run({
	//     eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
	//         console.log('consumed each message: ' , {
	//             key: message.key.toString(),
	//             value: message.value.toString(),
	//             headers: message.headers,
	//         })
	//     },
	// })
	consumer.run({
	    eachBatchAutoResolve: true,
	    eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
	        for (let message of batch.messages) {
	            console.log('consumed: ', {
	                topic: batch.topic,
	                partition: batch.partition,
	                highWatermark: batch.highWatermark,
	                message: {
	                    offset: message.offset,
	                    key: message.key.toString(),
	                    value: message.value.toString(),
	                    headers: message.headers,
	                }
	            })

	            // await processMessage(message)

	            resolveOffset(message.offset)
	            await heartbeat()
	        }
	    }
	})
}

// async function processMessage(message) {
// 	console.log('consumed: processMessage: message: ', message)
// }




setInterval(function() {
    console.log("timer that keeps nodejs processing running");
}, 1000 * 60 * 60);