import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    seeLikesPost: async (_, { postId }, { request }) => {
      isAuthenticated(request);
      try {
        const likeUsers = await prisma.likes({
          where: {
            AND: {
              post: { id: postId }
            }
          }
        }).user();
        return likeUsers.map(like => like.user);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
