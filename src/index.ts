import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import types from './types/types';
import resolvers from './resolvers';

const app = new Koa();
const server = new ApolloServer({
  typeDefs: types,
  resolvers: resolvers as any
});

server.applyMiddleware({
  app: app as any
});


let apollorun: any;

export async function start(port: number) {
  apollorun = await app.listen({ port }, () =>
    console.log(`ðŸš€ Server ready at http://localhost:${port}${server.graphqlPath}`),
  );
}

export async function stop() {
  return new Promise(resolve => apollorun.close(resolve));
}

start(4000);