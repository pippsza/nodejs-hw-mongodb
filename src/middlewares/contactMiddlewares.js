import pinoHttp from 'pino-http';
const logger = pinoHttp();

export function loggerMiddleware(req, res, next) {
  logger(req, res);
  //   req.log.info('something else');
  //   res.end('hello world');
  next();
}
