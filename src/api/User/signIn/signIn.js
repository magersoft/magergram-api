import { generateToken } from '../../../utils';
import { prisma } from '../../../../generated/prisma-client';
import bcrypt from 'bcrypt';

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export default {
  Mutation: {
    signIn: async (_, args) => {
      const { email, password } = args;
      try {
        const user = await prisma.user({ email });

        if (!user) {
          throw new Error('User not found');
        }

        let hashPassword;
        if (password) {
          hashPassword = await comparePassword(password, user.password);
        } else {
          throw new Error('User not found');
        }
        if (hashPassword) {
          return {
            error: null,
            token: generateToken(user.id)
          }
        } else {
          throw new Error('Wrong password!')
        }
      } catch (e) {
        return {
          error: e.message,
          token: null
        }
      }
    }
  }
}
