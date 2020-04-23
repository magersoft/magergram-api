import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../generated/prisma-client';

export default {
  Query: {
    seeLikesPost: async (_, { postId }, { request }): Promise<User[]> => {
      isAuthenticated(request);
      try {
        const likeUsers = await prisma.likes({
          where: {
            AND: {
              post: { id: postId }
            }
          }
          // @ts-ignore
        }).user();
        return likeUsers.map(like => like.user);
      } catch (e) {
        console.error(e);
        return [];
      }
    }
  }
}
