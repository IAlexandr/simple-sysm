const version = require('./package.json').version;
const optionsSpec = {
  PORT: {
    required: true,
    default: '4560',
    env: 'SYSM_PORT'
  },
  REGISTRATORS: {
    required: true,
    default: '1,2',
    env: 'SYSM_REGISTRATORS',
    preprocess: (src) => {
      return src.split(',');
    }
  },
  AMQP_HOST: {
    required: true,
    default: 'localhost',
    env: 'SYSM_AMQP_HOST'
  },
  DB_NAME: {
    required: true,
    default: 'cameraserver',
    env: 'SYSM_DB_NAME'
  },
  DB_CONN_USERNAME: {
    required: true,
    default: 'user',
    env: 'SYSM_DB_CONN_USERNAME'
  },
  DB_CONN_PASSWORD: {
    required: true,
    default: 'user21',
    env: 'SYSM_DB_CONN_PASSWORD'
  },
  DB_DIALECT: {
    required: true,
    default: 'postgres',
    env: 'SYSM_DB_DIALECT'
  },
  DB_CONN_HOST: {
    required: true,
    default: 'localhost',
    env: 'SYSM_DB_CONN_HOST'
  },
  DB_CONN_PORT: {
    required: true,
    default: '5432',
    env: 'SYSM_DB_CONN_PORT'
  }
};

let options = {
  version
};

export default {
  ...options, ...Object.keys(optionsSpec).map((key) => {
    if (!optionsSpec[key].preprocess) {
      optionsSpec[key].preprocess = function preprocess (str) {
        return str;
      };
    }
    const opt = { name: key };
    if (process.env[optionsSpec[key].env]) {
      opt.value = optionsSpec[key].preprocess(process.env[optionsSpec[key].env]);
    } else if (optionsSpec[key].default) {
      opt.value = optionsSpec[key].preprocess(optionsSpec[key].default);
    } else if (optionsSpec[key].required) {
      throw new Error('!!! REQUIRED OPTION NOT SET: ' + key);
    }
    return opt;
  }).reduce((prev, cur) => {
    prev[cur.name] = cur.value;
    return prev;
  }, {})
};
