import is from 'is_js';
import { prisma, User } from '../../../generated/prisma-client';
import { generateToken, verifyToken, VerifyTokenResponse } from '../../../utils/createJWT';
import { sendRecoveryPasswordEmail } from '../../../utils/sendEmail';
import { hashPassword } from '../../../utils/bcryptPassword';

type RecoveryPasswordResponse = {
  ok: boolean,
  error: string|null
}

type RecoveryPasswordTokenResponse = {
  ok: boolean,
  user: User|null,
  error: string|null
}

export default {
  Mutation: {
    recoveryPassword: async (_, { usernameOrEmail }): Promise<RecoveryPasswordResponse> => {
      try {
        const where: any = {};

        if (!usernameOrEmail) {
          throw new Error('Username or email does not exist');
        }

        where[is.email(usernameOrEmail) ? 'email' : 'username'] = usernameOrEmail;

        const user = await prisma.user(where);

        if (!user) {
          throw new Error('User not found');
        }

        if (!user.email) {
          throw new Error('In your account does not exist email address. Contact to developer in Telegram - magersoft')
        }

        const token = generateToken(user.id);

        sendRecoveryPasswordEmail(user.email, token);

        return {
          ok: true,
          error: null
        };
      } catch (e) {
        console.error(e);
        return {
          ok: false,
          error: e.message
        };
      }
    },
    recoveryPasswordByToken: async (_, { token }): Promise<RecoveryPasswordTokenResponse> => {
      try {
        const { decoded }: VerifyTokenResponse = await verifyToken(token);

        if (!decoded) {
          throw new Error('Token is not verify. Try again.');
        }

        const user = await prisma.user({ id: decoded.id });

        if (!user) {
          throw new Error('User not found');
        }

        return {
          ok: true,
          error: null,
          user
        };
      } catch (e) {
        console.error(e);
        return {
          ok: false,
          error: e.message,
          user: null
        };
      }
    },
    resetPassword: async (_, { userId, newPassword, confirmPassword }): Promise<RecoveryPasswordResponse> => {
      try {
        if (confirmPassword !== newPassword) {
          throw new Error('New password different')
        }

        const user: User | null = await prisma.user({ id: userId });

        if (!user) {
          throw new Error('User not found');
        }

        if (!newPassword) {
          throw new Error('Password is required');
        }

        if (newPassword.length < 6) {
          throw new Error('Password must be more 6 symbols');
        }

        const savePassword: string = await hashPassword(newPassword);

        await prisma.updateUser({
          data: {
            password: savePassword
          },
          where: {
            id: userId
          }
        })

        return {
          ok: true,
          error: null
        };
      } catch (e) {
        console.error(e);
        return {
          ok: false,
          error: e.message
        };
      }
    }
  },
}
