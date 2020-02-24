import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

const DELETE = 'DELETE';
const EDIT = 'EDIT';

export default {
  Mutation: {
    editPost: async (_, args, { request }) => {
      isAuthenticated(request);
      const { id, caption, location, action } = args;
      const { user } = request;
      const post = await prisma.$exists.post({ id, user: { id: user.id } });
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
      } else {
        throw Error('You can\'t do that')
      }
    }
  }
}
