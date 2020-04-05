import { generateToken } from '../../../utils/createJWT';
import { prisma } from '../../../../generated/prisma-client';
import { comparePassword } from '../../../utils/bcryptPassword';
import is from 'is_js';
import { isValidPhone } from '../../../utils/sendSMS';

export default {
  Mutation: {
    signIn: async (_, args) => {
      const { email, phone, password } = args;
      try {
        const where = {};
        if (phone) {
          if (phone.match(isValidPhone)) {
            where.phone = phone;
          }
        } else {
          if (email) {
            if (is.email(email)) {
              where.email = email;
            } else {
              where.username = email;
            }
          }
        }
        const user = await prisma.user(where);

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
