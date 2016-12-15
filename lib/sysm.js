import db from './db';
import Registrator from './registrator';
import mq from './mq';
import options from './../options';

class SysM {
  constructor (props) {

  }

  init () {
    mq.connect()
      .then(this.prepareRegistrators)
      .then(registrators => {

      })
      .catch(err => {
        throw err;
      });
  }

  getCameras () {
    return new Promise((resolve, reject) => {
      db.Camera.find();
    });
  }

  prepareRegistrators () {
    return new Promise((resolve, reject) => {
      options.REGISTRATORS.forEach((registratorId) => {
        // TODO пока просто создаем регистраторы
        const r = new Registrator({ registratorId, amqpHost: options.AMQP_HOST });
        r.connect()
          .then(() => {
            r.startRecording()
          })
          .catch(err => {
            throw err;
          });
      });
    });
  }

  listen () {
    // создание очереди, слушаем сообщения
  }

  addCamera () {  // а так же remove, update
    // TODO когда придет сообщение в очередь СУ о добавлении камеры
  }
}

const sysm = new SysM();
export default sysm;
