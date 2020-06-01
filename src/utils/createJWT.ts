import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export type VerifyTokenResponse = {
  [key: string]: any
}

export const generateToken = (id): string => jwt.sign({ id }, process.env.JWT_SECRET || '');

export const verifyToken = (token): Promise<VerifyTokenResponse> => new Promise((resolve, reject) => {
  jwt.verify(
    token,
    process.env.JWT_SECRET || '',
    (err: JsonWebTokenError, decoded) => {
      resolve({
        decoded
      });
      if (err) {
        reject(err);
      }
    });
});
