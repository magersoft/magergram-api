import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { prisma, User } from './generated/prisma-client';
import { ServerResponse } from 'http';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const verifyUser = async (payload, done): Promise<User | undefined> => {
  try {
    const user = await prisma.user({ id: payload.id });
    if (user) {
      return done(null, user)
    }
    return done(null, false)
  } catch (e) {
    return done(e, false);
  }
};

export const authenticateJwt = async (req, res, next): Promise<ServerResponse> => passport.authenticate('jwt', { sessions: false }, (error, user) => {
  if (user) {
    req.user = user;
  }
  next();
})(req, res, next);

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();
