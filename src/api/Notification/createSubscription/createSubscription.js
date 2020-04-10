import { prisma } from '../../../../generated/prisma-client';

export default {
  Mutation: {
    createSubscription: async (_, { subscription }, { request }) => {
      const { user } = request;
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
