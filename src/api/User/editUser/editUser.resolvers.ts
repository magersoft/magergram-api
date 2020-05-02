import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../generated/prisma-client';
import { isValidPhone } from '../../../utils/sendSMS';

export default {
  Mutation: {
    editUser: async (_, args, { request }): Promise<any> => {
      isAuthenticated(request);
      const user: User = request.user;

      try {
        const { phone } = args;
        let preparedPhone;
        if (phone) {
          if (!phone.match(isValidPhone)) {
            throw new Error('Enter a valid phone number');
          }
          preparedPhone = phone.replace('+', '').replace('8', '7');
        }
        const updatedUser = await prisma.updateUser({
          where: {
            id: user.id
          },
          data: { ...args, phone: preparedPhone }
        });
        return {
          ok: true,
          data: updatedUser,
          error: null
        }
      } catch (e) {
        return {
          ok: false,
          data: null,
          error: e.message
        }
      }
    }
  }
}
