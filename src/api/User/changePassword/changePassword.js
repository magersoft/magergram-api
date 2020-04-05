import { isAuthenticated } from '../../../middlewares';
import { prisma } from '../../../../generated/prisma-client';
import { comparePassword, hashPassword } from '../../../utils/bcryptPassword';

export default {
  Mutation: {
    changePassword: async (_, { currentPassword, newPassword }, { request }) => {
      isAuthenticated(request);
      try {
        const userId = request.user.id;
        const user = await prisma.user({ id: userId });
        const getHashPassword = await comparePassword(currentPassword, user.password);

        if (!getHashPassword) {
          throw new Error('Wrong password!')
        }

        if (!newPassword) {
          throw new Error('Password is required');
        }

        if (newPassword.length < 6) {
          throw new Error('Password must be more 6 symbols');
        }

        if (newPassword === currentPassword) {
          throw new Error('New password must be different from current password');
        }

        const savePassword = await hashPassword(newPassword);

        await prisma.updateUser({
          data: {
            password: savePassword
          },
          where: {
            id: userId
          }
        });

        return {
          ok: true,
          error: null
        }
      } catch (e) {
        return {
          ok: false,
          error: e.message
        }
      }
    }
  }
}
