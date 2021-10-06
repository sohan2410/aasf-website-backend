import Express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import * as os from 'os';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import oas from './oas';

import l from './logger';
import mongo from './mongo';

const app = new Express();
const exit = process.exit;

const limiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'test' ? process.env.RATE_LIMIT_TEST : process.env.RATE_LIMIT, // 10 seconds : 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    app.set('appPath', `${root}client`);
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '1mb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(Express.static(`${root}/public`));
    app.use(cors());
    app.use(limiter);
  }

  router(routes) {
    this.routes = routes;
    return this;
  }

  async load(port) {
    const welcome = p => () =>
      l.info(
        `up and running in ${process.env.NODE_ENV ||
          'development'} @: ${os.hostname()} on port: ${p}}`
      );

    await oas(app, this.routes);
    await mongo();

    l.info(`Database loaded!`);
    http.createServer(app).listen(port, welcome(port));
  }

  listen(port = process.env.PORT) {
    try {
      this.load(port);
    } catch (err) {
      l.error(err);
      exit(1);
    }

    return app;
  }
}
