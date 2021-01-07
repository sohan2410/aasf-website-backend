import * as express from 'express';
import userRouter from './controllers/users/router';
import eventRouter from './controllers/events/router';
import mailerRouter from './controllers/mailer/router';
import notificationsRouter from './controllers/notifications/router';

export default express
  .Router()
  .use('/users', userRouter)
  .use('/events', eventRouter)
  .use('/mail', mailerRouter)
  .use('/notifications', notificationsRouter);
