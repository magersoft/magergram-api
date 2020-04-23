import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../../generated/prisma-client';
import Notification, { INotification } from '../../../utils/Notification';

export default {
  Mutation: {
    toggleLike: async (_, args, { request }): Promise<boolean> => {
      isAuthenticated(request);
      const { postId } = args;
      const user: User = request.user;
      const filterOptions = {
        AND: [
          { user: { id: user.id } },
          { post: { id: postId } }
        ]
      };

      try {
        const authorPost: User = await prisma.post({ id: postId }).user();

        const existingLike: boolean = await prisma.$exists.like(filterOptions);
        if (existingLike) {
          await prisma.deleteManyLikes(filterOptions);
          await prisma.deleteManyNotifications({
            AND: [
              { type: "LIKE" },
              { user: { id: authorPost.id } },
              { post: { id: postId } },
              { subscriber: { id: user.id } }
            ]
          })
        } else {
          await prisma.createLike({
            user: {
              connect: {
                id: user.id
              }
            },
            post: {
              connect: {
                id: postId
              }
            }
          });

          if (authorPost.id !== user.id) {
            const existingNotification = await prisma.$exists.notification({
              AND: [
                { type: "LIKE" },
                { user: { id: authorPost.id } },
                { post: { id: postId } },
                { subscriber: { id: user.id } }
              ]
            });

            if (!existingNotification) {
              await prisma.createNotification({
                type: "LIKE",
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
                subscriber: {
                  connect: {
                    id: user.id
                  }
                }
              });

              const notification: INotification = new Notification(authorPost, {
                title: user.username
              }, 'like');
              await notification.push();

              if (authorPost.email && authorPost.emailNotification) {
                await notification.email();
              }
            }
          }
        }
        return true;
      } catch (e) {
        console.error(e);
        return false
      }
    }
  }
}
