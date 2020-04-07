import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    addComment: async (_, args, { request }) => {
      isAuthenticated(request);
      const { text, postId } = args;
      const { user } = request;
      try {
        const authorPost = await prisma.post({ id: postId }).user();

        const comment = await prisma.createComment({
          user: {
            connect: {
              id: user.id
            }
          },
          post: {
            connect: {
              id: postId
            }
          },
          text
        });

        if (authorPost.id !== user.id) {
          const existingNotification = await prisma.$exists.notification({
            AND: [
              { type: "COMMENT" },
              { post: { id: postId } },
              { comment: { id: comment.id } }
            ]
          });

          if (!existingNotification) {
            await prisma.createNotification({
              type: "COMMENT",
              user: {
                connect: {
                  id: authorPost.id
                }
              },
              post: {
                connect: {
                  id: postId
                }
              },
              comment: {
                connect: {
                  id: comment.id
                }
              },
              subscriber: {
                connect: {
                  id: user.id
                }
              }
            });
          }
        }

        return comment
      } catch (e) {
        console.error(e.message);
      }
    }
  }
}
