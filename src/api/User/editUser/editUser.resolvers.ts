import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../generated/prisma-client';

export default {
  Mutation: {
    editUser: async (_, args, { request }): Promise<User> => {
      isAuthenticated(request);
      const user: User = request.user;
      return await prisma.updateUser({
        where: {
          id: user.id
        },
        data: args
      })
    }
  }
}
