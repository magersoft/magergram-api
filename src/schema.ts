import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import { GraphQLSchema } from 'graphql';

const allTypes: GraphQLSchema[] = fileLoader(path.join(__dirname, '/api/**/*.graphql'));
const allResolvers: any[] = fileLoader(path.join(__dirname, '/api/**/*.resolvers.*'));

const schema = makeExecutableSchema({
  typeDefs: mergeTypes(allTypes),
  resolvers: mergeResolvers(allResolvers)
});

export default schema;
