import bcrypt from 'bcrypt';

const SALT = 10;

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const hashPassword = async password => {
  return await bcrypt.hash(password, SALT);
};

export { comparePassword, hashPassword }
