import { prisma } from '../../../../generated/prisma-client';
import bcrypt from 'bcrypt';
import { generateSecret, sendSecretMail } from '../../../utils';

const hashPassword = (password) => {
  return bcrypt.hash(password, 10)
};

export default {
  Mutation: {
    createAccount: async (_, args) => {
      const { username, email, password, firstName, lastName } = args;
      let savePassword;
      if (password) {
        savePassword = await hashPassword(password);
      } else {
        throw new Error('Password is required');
      }
      await prisma.createUser({
        username,
        email,
        password: savePassword,
        firstName,
        lastName
      });
      const loginSecret = generateSecret();
      await sendSecretMail(email, loginSecret);
      await prisma.updateUser({ data: { loginSecret }, where: { email } });
    }
  }
}
