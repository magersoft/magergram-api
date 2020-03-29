import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    seeUserPosts: async (_, { username, perPage, page }, { request }) => {
      isAuthenticated(request);
      return prisma.user({username}).posts({
        first: perPage,
        skip: perPage * page,
        orderBy: 'createdAt_DESC'
      });
    }
  }
}
