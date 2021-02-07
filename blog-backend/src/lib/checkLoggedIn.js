import { check } from '../api/auth/auth.ctrl';

const checkLoggedIn = (ctx, next) => {
  if (!ctx.state.user) {
    ctx.status = 401;
    return;
  }
  return next();
};
export default checkLoggedIn;
