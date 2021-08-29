const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const errorhandler = require('./middlewares/error-handler');
const { PORT, MONGO_URI, MONGO_OPTIONS } = require('./config');

const app = express();

app.use(cors());

mongoose.connect(MONGO_URI, MONGO_OPTIONS);

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use('/', express.json());

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorhandler);

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
