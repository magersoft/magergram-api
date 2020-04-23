import { isAuthenticated } from '../../../middlewares';
import { Post, prisma } from '../../../generated/prisma-client';

export default {
  Query: {
    seePostsUserMore: async(_, { id, username, perPage, page }, { request }): Promise<Post[]> => {
      isAuthenticated(request);
      return await prisma.user({ username }).posts({
        where: {
          id_not_in: [id]
        },
        first: perPage,
        skip: perPage * page,
        orderBy: 'createdAt_DESC'
      });
    }
  }
}
