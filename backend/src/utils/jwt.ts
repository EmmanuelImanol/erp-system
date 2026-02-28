import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export const generateJWT = (payload: JwtPayload, secret: string) => {
  const token = jwt.sign(payload, secret, { expiresIn: '30d' });
  return token;
};
