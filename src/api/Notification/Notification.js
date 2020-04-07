import { prisma } from '../../../generated/prisma-client';

export default {
  Notification: {
    user: ({ id }) => prisma.notification({ id }).user(),
    subscriber: ({ id }) => prisma.notification({ id }).subscriber(),
    post: ({ id }) => prisma.notification({ id }).post()
  }
}
