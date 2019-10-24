import { AuthChecker } from "type-graphql";
import * as jwt from 'jsonwebtoken';
import { ApolloError } from "apollo-server";
export const SECRET = 'sajldsalkj23492492u39 asdkahskdh$$!@cddfdf';

export const authChecker: AuthChecker<any> = (
  { root, args, context, info },
  roles,
) => {
  if (!context.req.headers.authorization) {
    throw new ApolloError(
      'No token found. You are not authorized!'
    )
  } else {
    let token = context.req.headers.authorization;
    token = token.slice(7, token.length)
    if (jwt.verify(token, SECRET)) {
      const data = jwt.decode(token)
      context.user = data
      return true;
    }
    return false;
  }
};