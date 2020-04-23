import { prisma, File, Comment, User, Like } from '../../generated/prisma-client';

export default {
  Post: {
    files: ({ id }): File[] => prisma.post({ id }).files(),
    comments: ({ id }): Comment[] => prisma.post({ id }).comments(),
    user: ({ id }): User => prisma.post({ id }).user(),
    likes: ({ id }): Like[] => prisma.post({ id }).likes(),
    likeCount: ({ id }): Promise<number> => prisma.likesConnection({
      where: {
        post: { id }
      }
    }).aggregate().count(),
    commentCount: ({ id }): Promise<number> => prisma.commentsConnection({
      where: {
        post: { id }
      }
    }).aggregate().count(),
    lastComments: ({ id }): Comment[] => prisma.post({ id }).comments({ last: 3 }),
    isLiked: (parent: User, _, { request }): Promise<boolean> => {
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
