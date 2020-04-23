import { isAuthenticated } from '../../../middlewares';
import { Post, prisma, User } from '../../../generated/prisma-client';

export default {
  Query: {
    seeUserPosts: async (_, { username, perPage, page }, { request }): Promise<Post[]> => {
      isAuthenticated(request);
      const userId = request.user.id;

      try {
        const user: User|null = await prisma.user({ username });

        if (!user) {
          throw new Error('User not found');
        }

        if (userId !== user.id) {
          if (user.isPrivate) {
            const userFollowers = await prisma.user({ username }).followers();
            if (!userFollowers.map(user => user.id).includes(userId)) {
              return [];
            }
          }
        }

        return prisma.user({ username }).posts({
          first: perPage,
          skip: perPage * page,
          orderBy: 'createdAt_DESC'
        });
      } catch (e) {
        console.error(e);
        return []
      }
    }
  }
}
