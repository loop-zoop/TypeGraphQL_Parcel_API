import { AuthChecker } from "type-graphql";
import * as jwt from 'jsonwebtoken';
export const SECRET = 'sajldsalkj23492492u39 asdkahskdh$$!@cddfdf';

export const authChecker: AuthChecker<any> = (
    { root, args, context, info },
    roles,
  ) => {
      let token = context.req.headers.authorization;
      token = token.slice(7, token.length)
      if(jwt.verify(token, SECRET)) {
          return true;
      }
    return false;
  };