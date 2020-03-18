import { prisma } from '../../../generated/prisma-client';

export default {
  Post: {
    files: ({ id }) => prisma.post({ id }).files(),
    comments: ({ id }) => prisma.post({ id }).comments(),
    user: ({ id }) => prisma.post({ id }).user(),
    likes: ({ id }) => prisma.post({ id }).likes(),
    likeCount: ({ id }) => prisma.likesConnection({
      where: {
        post: { id }
      }
    }).aggregate().count(),
    commentCount: ({ id }) => prisma.commentsConnection({
      where: {
        post: { id }
      }
    }).aggregate().count(),
    lastComments: ({ id }) => prisma.post({ id }).comments({ last: 3 }),
    isLiked: (parent, _, { request }) => {
      const { user } = request;
      const { id } = parent;
      return prisma.$exists.like({
        AND: [
          {
            user: {
              id: user.id
            },
          },
          {
            post: {
              id
            }
          }
        ]
      })
    }
  }
}
