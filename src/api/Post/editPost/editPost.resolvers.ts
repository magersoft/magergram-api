import { isAuthenticated } from '../../../middlewares';
import { prisma, Post, User } from '../../../generated/prisma-client';

export default {
  Mutation: {
    editPost: async (_, args, { request }): Promise<Post|null> => {
      isAuthenticated(request);
      const { id, caption, location } = args;
      const user: User = request.user;
      const post: boolean = await prisma.$exists.post({ id, user: { id: user.id } });
      if (post) {
        return await prisma.updatePost({
          where: {
            id
          },
          data: {
            caption, location
          }
        });
      } else {
       return null
      }
    }
  }
}
