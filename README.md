# Example
A guide and example code to authenticate and using kafka using SASL_SSL adn \*.jks file on NodeJS

Preparation:
1. Buy kafka cluster on kafkacluster.com
```
https://clients.cloudclusters.io/

Host
***.cloudclusters.net

Port
***

IP Address
***

Security Type
SASL_SSL

SASL Mechanism
SCRAM-SHA-256

Truststore
kafka.truststore.jks

Truststore Password
***

Keystore
kafka.keystore.jks

Keystore Password
****
```


The problem is nodejs does not default support keystore/truststore machenism provided.

We need to convert keystore into native nodejs tls option, from keystore to cert + key + ca files


Put those 2 files into secrets folder:
```
secrets/kafka.keystore.jks
secrets/kafka.truststore.jks
```

```
yarn install 
```


2. Run
```
# on terminal tab 1
node kafka_consumer.js

# on terminal tab 2
node kafka_producer.js
```

