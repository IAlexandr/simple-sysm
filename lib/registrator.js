import amqp from 'amqplib/callback_api';

export default class {
  constructor (props) {
    const { registratorId, amqpHost } = props;
    this.registratorId = registratorId;
    this.amqpHost = amqpHost;
  }

  connect () {
    return new Promise ((resolve, reject) => {
      amqp.connect(`amqp://${this.amqpHost}`, (err, conn) => {
        if (err) {
          // TODO
          console.log(err.message);
          return reject(err);
        }
        this.conn = conn;
        this.conn.createChannel((err, ch) => {
          if (err) {
            // TODO послать сообщение в логгер
            console.log(err.message);
            throw err;
          }
          this.ch = ch;
          this.listen();
          return resolve();
        });
      });
    });
  }

  listen () {
    var q = `registrator_${this.registratorId}`;
    this.ch.assertQueue(q, { durable: false });
    console.log(" [*] Waiting for message in %s.", q);
    this.ch.consume(q, (msg) => {
      var message = JSON.parse(msg.content.toString() || '');
      console.log(" [x] Received %s", message);
      const { type, body } = message;
      switch (type) {
        case 'test message':
          console.log(type, body);
          break;
        default:
          break;
      }
      this.ch.ack(msg);
    }, { noAck: false });
  }

  sendToQueue (q, msg) {
    this.ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, new Buffer(msg), {persistent: true});
    console.log(" [x] Sent '%s'", msg);
  }

  startRecording (connectionInfo) {
    var q = `registrator_${this.registratorId}`;
    const msg = {
      type: 'start recording',
      body: connectionInfo
    };
    this.sendToQueue(q, msg);
  }

  stopRecording (connectionInfo) {
    var q = `registrator_${this.registratorId}`;
    const msg = {
      type: 'stop recording',
      body: connectionInfo
    };
    this.sendToQueue(q, msg);
  }
}
