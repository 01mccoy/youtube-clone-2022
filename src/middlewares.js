export const localsMiddleware = (req, res, next) => {
  // 'res' 는 매 res/req 마다 개별적으로 구별되는 unique 한 객체
  // 다만, session 은 서버 종료 전까지는 따로 보관되어 저장되는 저장소
  // req, res 는 매번 갱신되지만, session 은 유지됨!
  // 그래서, 미들웨어를 통해 매번 res.locals (응답을 보낼 때 가지는 로컬변수) => 라이프사이클관련 | 에 변수 지정

  // 이 미들웨어는 매 res/req 마다 실행
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  next();
};
