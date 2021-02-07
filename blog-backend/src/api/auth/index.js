import Router from 'koa-router';
import * as authCtrl from './auth.ctrl';

const auth = new Router();

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.get('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);
/*
auth.post('/test', (ctx) => {
  console.log('테스트 성공');
  ctx.body = '테스트';
});
*/

export default auth;
