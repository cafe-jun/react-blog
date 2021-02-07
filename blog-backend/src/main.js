require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';

//import createKakeData from './createFakeData';

const { PORT, MONGO_URL } = process.env;
const port = PORT || 4000;
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    //createKakeData();
  })
  .catch((e) => {
    console.log(e);
  });

//const api = require('./api');
const app = new Koa();

const router = new Router();

router.use('/api', api.routes());
app.use(bodyParser());
app.use(jwtMiddleware);

/*
router.get('/', (ctx) => {
  ctx.body = '홈';
});
router.get('/about/:name', (ctx) => {
  const { name } = ctx.params;
  ctx.body = name ? `${name}의 소개` : '소개';
});
router.get('/posts', (ctx) => {
  const { id } = ctx.query;
  ctx.body = id ? `포스트 #${id}` : '포스트 id 가 없습니다.';
});
*/

//app 인스턴스에 Router 적용
app.use(router.routes()).use(router.allowedMethods());

/*
app.use(async (ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  if (ctx.query.authorized !== '1') {
    ctx.status = 401;
    return;
  }
  await next();
  console.log('END');
});

app.use((ctx, next) => {
  console.log(2);
  next();
});
*/

app.listen(port, () => {
  console.log('Listening to port %d', port);
});
