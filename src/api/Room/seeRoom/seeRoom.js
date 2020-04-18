import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';

export default {
  Query: {
    seeRoom: async (_, { id }, { request }) => {
      isAuthenticated(request);
      const { user } = request;
      const canSee = await prisma.$exists.room({
        participants_some: {
          id: user.id
        }
      });
      if (canSee) {
        const participants = await prisma.room({ id }).participants();
        const itsMe = participants.filter(participant => participant.id === user.id)[0];

        await prisma.updateManyMessages({
          data: {
            read: true
          },
          where: {
              room: { id },
              to: { id: itsMe.id }
          }
        });

        return await prisma.room({ id });
      } else {
        throw Error('You can\'t see this')
      }
    },
    seeMessages: async (_, { roomId, perPage, page }, { request }) => {
      isAuthenticated(request);
      return await prisma.room({ id: roomId }).messages({
        last: perPage,
        skip: perPage * page,
      })
    }
  }
}
