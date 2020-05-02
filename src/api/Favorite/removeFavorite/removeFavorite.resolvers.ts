import { prisma, User } from '../../../generated/prisma-client';
import { isAuthenticated } from '../../../middlewares';

export default {
  Mutation: {
    removeFavorite: async (_, { postId }, { request }): Promise<boolean> => {
      isAuthenticated(request);
      const user: User = request.user;
      try {
        await prisma.deleteManyFavorites({
          AND: [
            { post: { id: postId } },
            { user: { id: user.id } }
          ]
        });
        return true;
      } catch (e) {
        console.error(e.message);
        return false;
      }
    }
  }
}
