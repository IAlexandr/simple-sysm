import options from './options';
import Registrator from './lib/registrator';

export default function () {
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
}
