import { prisma, User } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    createSubscription: async (_, { subscription }, { request }): Promise<boolean> => {
      const user: User = request.user;
      try {
        await prisma.updateUser({
          data: {
            subscriptionEndpoint: subscription
          },
          where: {
            id: user.id
          }
        });
        return true;
      } catch (e) {
        console.error(e.message);
        return false
      }
    }
  }
}
