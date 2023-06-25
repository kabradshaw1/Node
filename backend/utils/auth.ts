import jwt from 'jsonwebtoken';

const secret = 'mysecretsshhhhh';
const expiration = '2h';

export const authMiddleware = function ({ req }: any) {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration }) as any;
    req.user = data;
  } catch {
    console.log('Invalid token');
  }

  return req;
};

export const signToken = function ({ firstName, email, _id }: any) {
  const payload = { firstName, email, _id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};