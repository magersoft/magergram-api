import { Post, prisma, User } from '../../generated/prisma-client';

export default {
  Like: {
    post: ({ id }): Post => prisma.like({ id }).post(),
    user: ({ id }): User => prisma.like({ id }).user()
  }
}
