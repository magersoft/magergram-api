import { isAuthenticated } from '../../../middlewares';
import { Message, prisma, User } from '../../../generated/prisma-client';
import Notification from '../../../utils/Notification';

export default {
  Mutation: {
    sendMessage: async (_, args, { request }): Promise<Message> => {
      isAuthenticated(request);

      const user: User = request.user;
      const { roomId, message, toId } = args;

      let room;
      if (!roomId) {
        if (user.id !== toId) {
          room = await prisma.createRoom({
            participants: {
              connect: [{ id: toId }, { id: user.id }]
            }
          })
        }
      } else {
        room = await prisma.room({
          id: roomId
        });
      }

      if (!room) {
        throw Error('Room not found');
      }

      const toUser: User | null = await prisma.user({ id: toId });
      const notification = new Notification(toUser, {
        title: user.username
      }, 'message');
      notification.push();
      // notification.email();

      return await prisma.createMessage({
        text: message,
        from: {
          connect: {
            id: user.id
          },
        },
        to: {
          connect: {
            id: toId
          }
        },
        room: {
          connect: {
            id: room.id
          }
        }
      });
    }
  }
}
