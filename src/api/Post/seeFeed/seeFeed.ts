import { Post, prisma, User } from '../../../../generated/prisma-client';
import { isAuthenticated } from '../../../middlewares';

export default {
  Query: {
    seeFeed: async(_, { perPage, page }, { request }): Promise<Post[]> => {
      isAuthenticated(request);
      const user: User = request.user;
      const following: User[] = await prisma.user({
        id: user.id
      }).following();
      return await prisma.posts({
        first: perPage,
        skip: perPage * page,
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
