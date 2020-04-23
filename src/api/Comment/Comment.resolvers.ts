import { prisma, Post, User } from '../../generated/prisma-client';

export default {
  Comment: {
    user: ({ id }): User => prisma.comment({ id }).user(),
    post: ({ id }): Post => prisma.comment({ id }).post()
  }
}
