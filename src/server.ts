import './env';
import express  from 'express';
import { GraphQLServer } from 'graphql-yoga';
import logger from 'morgan';
import schema from './schema';
import { authenticateJwt } from './passport';
import './passport';
import cors from 'cors';

const PORT: number | string = process.env.PORT || 4000;

const server: GraphQLServer = new GraphQLServer({
  schema,
  context: ({request}) => ({ request })
});

const options = {
  port: PORT
};

server.express.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
server.express.use(logger('dev'));
server.express.use(authenticateJwt);
server.express.use('/static', express.static(process.cwd() + '/uploads'));
server.express.use(cors())

server.start(options, () => console.log(`✅ Server running on port http://localhost:${PORT}`));
