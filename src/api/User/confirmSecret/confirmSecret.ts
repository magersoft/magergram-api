import { prisma, User } from '../../../../generated/prisma-client';
import { generateToken } from '../../../utils/createJWT';

export default {
  Mutation: {
    confirmSecret: async (_, args): Promise<string|void> => {
      const { email, phone, secret } = args;

      try {
        const user: User|null = await prisma.user({ email, phone });

        if (!user) {
          throw new Error('User not found');
        }

        if (user.loginSecret === secret) {
          await prisma.updateUser({ where: { id: user.id }, data: { loginSecret: '' } });
          return generateToken(user.id);
        } else {
          throw Error('Wrond email/secret combination');
        }
      } catch (e) {
        console.error(e.message);
      }
    }
  }
}
