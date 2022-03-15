import "reflect-metadata";
import { createConnection } from 'typeorm';
import { __COOKIE_SECRET__, __prod__ } from './constants';
import express from 'express';
import session from 'express-session';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import cors from 'cors';
import connectRedis from 'connect-redis'

const Redis = require('ioredis');

const main = async () => {

    const conn = await createConnection({
        type: 'postgres',
        database: 'dbname',
        username: 'user',
        password: 'password',
        logging: true, 
        synchronize: !__prod__,
        entities: [], 
    });
    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(cors({
      origin: Array('http://localhost:3000',"https://studio.apollographql.com"),
      credentials: true,
    }));
    
    app.use(
        session({
          name: "COOKIE_SOSMO345FZRTXZRE",
          store: new RedisStore({ 
              client: redis,
              disableTouch: true,
          }),

          cookie: {
            maxAge: 1000 * 60 * 24 * 60 * 365,
            httpOnly: true,
            sameSite: 'lax',
            secure:__prod__,
          },
          saveUninitialized: false,
          secret: __COOKIE_SECRET__,
          resave: false,
        })
      );

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers:[
                HelloResolver,
            ],
            validate: false
        }),
        context: ({req, res}) => ({req, res, redis}),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });
};

main().catch((err) => {
    console.error(err);
  });

