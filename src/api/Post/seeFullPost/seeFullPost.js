import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    seeFullPost: (_, args) => prisma.post(args)
  }
};
