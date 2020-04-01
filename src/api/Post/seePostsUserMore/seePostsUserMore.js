import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    seePostsUserMore: async(_, { id, username, perPage, page }, { request }) => {
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
