import { prisma } from '../../../../generated/prisma-client';
import { generateSecret, sendSecretMail } from '../../../utils/sendEmail';
import { hashPassword } from '../../../utils/bcryptPassword';
import is from 'is_js';
import { isValidPhone, sendVerificationSMS } from '../../../utils/sendSMS';

export default {
  Mutation: {
    createAccount: async (_, args) => {
      const { username, email, phone, password, firstName, lastName } = args;
      try {
        if (email) {
          if (!is.email(email)) {
            throw new Error('Enter a valid email address');
          }
        } else {
          if (phone) {
            if (!phone.match(isValidPhone)) {
              throw new Error('Enter a valid phone number');
            }
          } else {
            throw new Error('Email or phone required field');
          }
        }

        if (password.length < 6) {
          throw new Error('Password must be more 6 symbols');
        }

        let savePassword;
        if (password) {
          savePassword = await hashPassword(password);
        } else {
          throw new Error('Password is required');
        }

        let preparedPhone;
        if (phone) {
          preparedPhone = phone.replace('+', '').replace('8', '7');
        }

        if (!(/^[a-z-0-9]+$/.test(username))) {
          throw new Error('Only english lower case letter and digits');
        }

        await prisma.createUser({
          username: username.trim(),
          email,
          phone: preparedPhone,
          password: savePassword,
          firstName,
          lastName
        });

        const loginSecret: string|void = generateSecret(phone ? 'PHONE' : 'EMAIL');

        if (!loginSecret) {
          throw new Error('Login secret not be a generated');
        }

        if (phone) {
          await sendVerificationSMS(preparedPhone, loginSecret);
        } else {
          await sendSecretMail(email, loginSecret);
        }
        await prisma.updateUser({ data: { loginSecret }, where: { email, phone: preparedPhone } });
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
    },
    checkExistUsername: async (_, args) => {
      const { username } = args;
      try {
        const user = await prisma.user({ username });
        if (!(/^[a-z-0-9]+$/.test(username))) {
          throw new Error('Only english lower case letter and digits');
        }
        if (user) {
          throw new Error('Username is already in use')
        }
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
