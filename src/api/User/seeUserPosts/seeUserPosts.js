import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    seeUserPosts: async (_, { username, perPage, page }, { request }) => {
      isAuthenticated(request);

      const userId = request.user.id;
      const user = await prisma.user({ username });

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
    }
  }
}
