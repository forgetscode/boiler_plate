# Code to bootstrap a web3 app + web2 server backend using typescript
[Demo(Server-Not-Connected)](https://sosmo.vercel.app/)


Stack
- Apollo Server with graphql
- postgres(optional)
- typeorm
- expressJS
- Redis

App
- NextJs
- Apollo client with graphql
- Tailwind
- Anchor/Solana web3 js api

## Server folder

Install dependancies
>yarn install

#### Important: Configure your personal database database settings in the index.ts file(const conn li:17)

## Start your servers

postgres, if using postgres

>sudo service postgresql start
  
redis

>redis-server
  
server(port:4000)

>yarn watch
>
>yarn dev

yarn watch creates a watcher to automatically re-run yarn dev when file changes occur

## App folder

Install dependancies

>yarn install
  
app client(port:3000)
  
>yarn dev

graphql client configuration if needed

https://docs.google.com/document/d/1Zes9rHTxcBHTKIb3_4snTdmP4UPY6rCToi6aGCIBdr4/edit?usp=sharing
