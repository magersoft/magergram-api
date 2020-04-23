import { isAuthenticated } from '../../../middlewares';
import { Post, prisma, User } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    addPost: async (_, args, { request }): Promise<Post> => {
      isAuthenticated(request);
      const user: User = request.user;
      const { caption, location, files } = args;
      const post: Post = await prisma.createPost({
        caption, location, user: { connect: { id: user.id } }
      });
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await prisma.createFile({
          url: file,
          post: {
            connect: {
              id: post.id
            }
          }
        })
      }
      return post;
    }
  }
}
