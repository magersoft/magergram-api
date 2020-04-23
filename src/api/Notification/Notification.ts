import { Post, prisma, User } from '../../../generated/prisma-client';

export default {
  Notification: {
    user: ({ id }): User => prisma.notification({ id }).user(),
    subscriber: ({ id }): User => prisma.notification({ id }).subscriber(),
    post: ({ id }): Post => prisma.notification({ id }).post()
  }
}
