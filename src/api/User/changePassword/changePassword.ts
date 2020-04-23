import { isAuthenticated } from '../../../middlewares';
import { prisma, User } from '../../../../generated/prisma-client';
import { comparePassword, hashPassword } from '../../../utils/bcryptPassword';

export default {
  Mutation: {
    changePassword: async (_, { currentPassword, newPassword }, { request }): Promise<any> => {
      isAuthenticated(request);
      try {
        const userId = request.user.id;
        const user: User|null = await prisma.user({ id: userId });

        if (!user) {
          throw new Error('User not found');
        }

        const getHashPassword: boolean = await comparePassword(currentPassword, user.password);

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

        const savePassword: string = await hashPassword(newPassword);

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
