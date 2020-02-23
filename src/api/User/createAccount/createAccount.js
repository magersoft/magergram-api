import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    createAccount: async (_, args) => prisma.createUser(args)
  }
}
