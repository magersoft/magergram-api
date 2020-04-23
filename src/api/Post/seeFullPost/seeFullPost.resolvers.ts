import { Post, prisma } from '../../../generated/prisma-client';

export default {
  Query: {
    seeFullPost: (_, args): Promise<Post|null> => prisma.post(args)
  }
};
