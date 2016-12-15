import amqp from 'amqplib/callback_api';
import options from './../options';

class Amqp {
  constructor (props) {
    const { amqpHost } = props;
    this.amqpHost = amqpHost;
  }

  connect () {
    return new Promise((resolve, reject) => {
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
          return resolve();
        });
      });
    });
  }

  listen ({ q, callback }) {
    this.ch.assertQueue(q, { durable: false });
    console.log(" [*] Waiting for message in %s.", q);
    this.ch.consume(q, callback, { noAck: false });
  }
}

const MQ = new Amqp({ amqpHost: options.AMQP_HOST });

export default MQ;
