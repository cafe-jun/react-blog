import Joi from '@hapi/joi';
import User from '../../models/user';

/*
    POST /api/auth/register
    {
        username : 'jsshin',
        password : 'password123'
    }
*/

export const register = async (ctx) => {
  // 회원 가입
  // Request Body 검증하기
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  const { username, password } = ctx.request.body;
  try {
    //username 이 이미 존재하는지 확인
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 400;
      return;
    }
    const user = new User({
      username,
    });
    await user.setPassword(password);
    await user.save();
    const data = user.toJSON();
    delete data.hashedPassword;
    ctx.body = user.serialize();
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일
      httpOnly: true,
    });
  } catch (error) {
    ctx.throw(500, error);
  }
};

export const login = async (ctx) => {
  // 로그인
  const { username, password } = ctx.request.body;
  if (!username || !password) {
    ctx.status = 401;
    return;
  }
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일
      httpOnly: true,
    });
  } catch (error) {
    ctx.throw(500, error);
  }
};
export const check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};

export const logout = async (ctx) => {
  // 로그 아웃
  ctx.cookies.set('access_token');
  ctx.status = 204; //No Content
};
