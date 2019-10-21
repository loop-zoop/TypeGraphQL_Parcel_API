import "reflect-metadata";
import {createConnection} from "typeorm";
import { ApolloServer, gql} from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { ParcelResolver } from "./resolvers/ParcelResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { authChecker } from './scripts/authChecker'

async function startServer() {
    await createConnection();
    const schema = await buildSchema({
        resolvers: [ParcelResolver, UserResolver],
        authChecker
    });
    const server = new ApolloServer({
        schema, 
        playground: true, 
        context: ({ req }) => {
            const context = {
                req
            };
            return context;
        }
    });
    server.listen().then(({ url }) => {
        console.log(`Server ready at ${url}`)
    });
};

startServer().catch(e => {
  console.log(e)
})