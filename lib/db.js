import Sequelize from 'sequelize';
import options from './../options';

const sequelize = new Sequelize(options.DB_NAME, options.DB_CONN_USERNAME, options.DB_CONN_PASSWORD, {
  dialect: options.DB_DIALECT, // or 'sqlite', 'postgres', 'mariadb'
  host: options.DB_CONN_HOST,
  port: options.DB_CONN_PORT,
  logging: false,
});

const CameraType = sequelize.define('camera', {
  rtspUrlTail: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  }
});
const Camera = sequelize.define('camera', {
  address: {
    type: Sequelize.STRING
  },
  ip: {
    type: Sequelize.STRING
  },
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  query: {
    type: Sequelize.STRING
  }
});

sequelize.CameraType = CameraType;
sequelize.Camera = Camera;
CameraType.hasMany(Camera, { as: 'Cameras' });

const Session = sequelize.define('session', {
  startedAt: {
    type: Sequelize.DATE
  },
  stoppedAt: {
    type: Sequelize.DATE
  },
  mpdProps: {
    type: Sequelize.JSON
  },
  isWorking: {
    type: Sequelize.BOOLEAN
  },
});

const Segment = sequelize.define('segment', {
  duration: {
    type: Sequelize.INTEGER
  },
  chunkNumber: {
    type: Sequelize.STRING
  }
});
sequelize.Session = Session;
sequelize.Segment = Segment;
Session.hasMany(Segment, { as: 'Segments' });

export default sequelize;
