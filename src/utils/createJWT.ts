import jwt from 'jsonwebtoken';

export const generateToken = (id): string => jwt.sign({ id }, process.env.JWT_SECRET || '');
