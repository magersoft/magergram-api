import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    seeUser: async (_, args, { request }) => {
      isAuthenticated(request);
      const { username } = args;
      return await prisma.user({ username });
    }
  }
}
