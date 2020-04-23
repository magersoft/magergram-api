import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../../generated/prisma-client';

export default {
  Query: {
    seeUser: async (_, args, { request }): Promise<User|null> => {
      isAuthenticated(request);
      const { username } = args;
      try {
        return await prisma.user({ username });
      } catch (e) {
        console.error(e.message);
        return null;
      }
    }
  }
}
