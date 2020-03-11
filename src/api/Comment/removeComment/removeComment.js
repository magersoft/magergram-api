import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    removeComment: async (_, args, { request }) => {
      isAuthenticated(request);
      const { id } = args;
      const { user } = request;
      const comment = prisma.comment({ id });
      const commentUserId = await comment.user().id().then(id => id);
      if (user.id !== commentUserId) {
        throw Error('You cannot be perform this action');
      }
      await prisma.deleteComment({ id });
      return id;
    }
  }
}
