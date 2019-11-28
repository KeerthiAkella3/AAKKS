var kafka = require('kafka-node');
var config = require('../config/settings');
const kafkaConn = config.kafka_host + ":" + config.kafka_port;

function ConnectionProvider() {
    this.getConsumer = function(topic_name) {
       // if (!this.kafkaConsumerConnection) {
            this.client = new kafka.KafkaClient(kafkaConn);
            this.kafkaConsumerConnection = new kafka.Consumer(this.client,[ { topic: topic_name, partition: 0, offset: 0 }]);
            this.client.on('ready', function () { console.log('Consumer is ready for topic:', topic_name) })
         //}
        return this.kafkaConsumerConnection;
    };

   //Code will be executed when we start Producer
    this.getProducer = function() {

        if (!this.kafkaProducerConnection) {
            this.client = new kafka.KafkaClient(kafkaConn);
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            console.log('Topic Producer is ready');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;