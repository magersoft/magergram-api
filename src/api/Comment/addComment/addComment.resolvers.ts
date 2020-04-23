import { isAuthenticated } from '../../../middlewares';
import { Comment, prisma } from '../../../generated/prisma-client';
import Notification from '../../../utils/Notification';

export default {
  Mutation: {
    addComment: async (_, args, { request }): Promise<Comment|void> => {
      isAuthenticated(request);
      const { text, postId } = args;
      const { user } = request;
      try {
        const authorPost = await prisma.post({ id: postId }).user();

        const comment: Comment = await prisma.createComment({
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

            const notification = new Notification(authorPost, {
              title: user.username,
              comment: comment.text
            }, 'comment');
            await notification.push();

            if (authorPost.email && authorPost.emailNotification) {
              await notification.email();
            }
          }
        }

        return comment
      } catch (e) {
        console.error(e.message);
      }
    }
  }
}
