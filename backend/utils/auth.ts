import jwt, { Secret } from 'jsonwebtoken';
import { Request, RequestHandler } from 'express';

interface UserPayload {
  username: string;
  email: string;
  _id: string;
}

// Define a new interface that extends the Request interface
interface RequestWithUser extends Request {
  user?: UserPayload;
}

const secret: Secret = 'mysecretsshhhhh';
const expiration: string = '2h';

export function authMiddleware(): RequestHandler {
  return (req: RequestWithUser, res, next) => {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return next();
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration }) as { data: UserPayload };
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    next();
  };
}

export function signToken({ username, email, _id }: UserPayload): string {
  const payload = { username, email, _id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}
