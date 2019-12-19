const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  // 从请求头中取出 token
  const token = req.get('ACCESS_TOKEN')
  if (!token) {
    res.status(401).send({
      msg: '未登录'
    })
    return
  }
  // token存在，需要校验token的有效性
  try {
    const payload = jwt.verify(token, 'MY')
    // 给req身上添加userInfo
    req.userInfo = payload
    next()
  } catch (error) {
    res.status(401).send({
      msg: 'invalid token'
    })
  }
}
module.exports = auth