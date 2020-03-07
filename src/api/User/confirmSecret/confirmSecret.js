import { prisma } from '../../../../generated/prisma-client';
import { generateToken } from '../../../utils/createJWT';

export default {
  Mutation: {
    confirmSecret: async (_, args) => {
      const { email, phone, secret } = args;
      const user = await prisma.user({ email, phone });
      if (user.loginSecret === secret) {
        await prisma.updateUser({ where: { id: user.id }, data: { loginSecret: '' } });
        return generateToken(user.id);
      } else {
        throw Error('Wrond email/secret combination');
      }
    }
  }
}
