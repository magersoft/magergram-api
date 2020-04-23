import { isAuthenticated } from '../../../middlewares';
import { prisma, Post, User } from '../../../generated/prisma-client';

const DELETE = 'DELETE';
const EDIT = 'EDIT';

export default {
  Mutation: {
    editPost: async (_, args, { request }): Promise<Post|null> => {
      isAuthenticated(request);
      const { id, caption, location, action } = args;
      const user: User = request.user;
      const post: boolean = await prisma.$exists.post({ id, user: { id: user.id } });
      if (post) {
        if (action === EDIT) {
          return await prisma.updatePost({
            where: {
              id
            },
            data: {
              caption, location
            }
          })
        } else if (action === DELETE) {
          return await prisma.deletePost({ id })
        }
        return null;
      } else {
       return null
      }
    }
  }
}
