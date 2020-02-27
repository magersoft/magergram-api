import { prisma } from '../../../../generated/prisma-client';
import { isAuthenticated } from '../../../middlewares';

export default {
  Query: {
    seeFeed: async(_, __, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      const following = await prisma.user({
        id: user.id
      }).following();
      return await prisma.posts({
        where: {
          user: {
            id_in: [...following.map(user => user.id), user.id]
          }
        },
        orderBy: 'createdAt_DESC'
      })
    }
  }
}
