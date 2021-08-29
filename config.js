require('dotenv').config();

const {
  PORT = 8000,
  MONGO_URI = 'mongodb://localhost:27017/moviesdb',
  JWT_SECRET = 'super-mega-secret',
  NODE_ENV,
} = process.env;

const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

module.exports = {
  PORT, MONGO_URI, JWT_SECRET, NODE_ENV, MONGO_OPTIONS,
};
