import { withFilter } from 'graphql-yoga';
import { prisma } from '../../../../generated/prisma-client';
import { isAuthenticated } from '../../../middlewares';

export default {
  Subscription: {
    typingMessage: {
      subscribe: withFilter(
        (_, __, { pubSub }) => pubSub.asyncIterator('typingMessage'),
        async payload => {
          console.log('sub', payload);
          return payload;
        }
      ),
      resolve: payload => payload
    }
  },
  Mutation: {
    typingMessage: (_, { roomId, toUserId, typing }, { request, pubSub }) => {
      isAuthenticated(request);
      if (!typing) {
        pubSub.publish('typingMessage', false);
      }
      const { user } = request;
      // const participants = await prisma.room({ id: roomId }).participants();
      // const toUser = participants.filter(participant => participant.id !== user.id)[0];
      pubSub.publish('typingMessage', user.id === toUserId);
      return user.id === toUserId;
    }
  }
}
