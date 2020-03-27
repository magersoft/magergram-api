import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    removePost: async (_, { id }, { request }) => {
      isAuthenticated(request);
      try {
        await prisma.deletePost({ id });
        return true;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    }
  }
}
