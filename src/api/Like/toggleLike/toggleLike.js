import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    toggleLike: async (_, args, { request }) => {
      isAuthenticated(request);
      const { postId } = args;
      const { user } = request;
      const filterOptions = {
        AND: [
          { user: { id: user.id } },
          { post: { id: postId } }
        ]
      };

      try {
        const authorPost = await prisma.post({ id: postId }).user();

        const existingLike = await prisma.$exists.like(filterOptions);
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
            }
          }
        }
        return true;
      } catch (e) {
        return false
      }
    }
  }
}
