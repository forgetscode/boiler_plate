import "reflect-metadata";
import { createConnection } from 'typeorm';
import { __COOKIE_SECRET__, __prod__ } from './constants';
import express from 'express';
import session from 'express-session';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import cors from 'cors';
import connectRedis from 'connect-redis'
import { UserResolver } from "./resolvers/user";

const Redis = require('ioredis');

const main = async () => {

    //db settings, configure these yourself
    const conn = await createConnection({
        type: 'postgres',
        database: 'db',
        username: 'dbuser',
        password: 'dbpass',
        logging: true, 
        synchronize: !__prod__,
        entities: [], 
    });

    //initialize express server
    const app = express();

    //initialize redis server
    const RedisStore = connectRedis(session);
    const redis = new Redis();

    //configure cors settings
    app.use(cors({
      origin: Array('http://localhost:3000',"https://studio.apollographql.com"),
      credentials: true,
    }));
    
    //configure user cookie settings
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

    //graphql server configuration
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers:[
              UserResolver,
            ],
            validate: false
        }),
        context: ({req, res}) => ({req, res, redis}),
    });

    //start graphql server
    await apolloServer.start();

    apolloServer.applyMiddleware({
      app,
      cors: false,
    });

    //port 4000
    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    });

};

main().catch((err) => {
    console.error(err);
  });

