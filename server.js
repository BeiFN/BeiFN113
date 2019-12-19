const express = require('express')
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserModel = require('./models/user')
const Auth = require('./middlewares/auth')
const app = express()

// mongoose 链接
mongoose.connect('mongodb://127.0.0.1:27017/qqmusic',{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("数据库链接成功！")
}).catch(() => {
  console.log("数据库链接失败！")
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'content-type')
  next()
})

// const time = (time = 1500) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve()
//     }, time)
//   })
// }

// 登录
app.post('/login', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let isOk = false

  const user = await UserModel.findOne({ username })
  if (user) {
    isOk = await bcryptjs.compare(password, user.password)
  }
  if (!isOk) {
    res.send({
      code: -1,
      msg: '用户名或密码不正确'
    })
  }
  let payload  = {
    userId: user._id,
    username: user.username,
    avatar: user.avatar
  }
  let token = jwt.sign(payload, 'MY')
  res.send({
    code: 0,
    msg: '登录成功',
    data: {
      userInfo: payload,
      token
    }
  })
})
// 注册
app.post('/register', async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let avatar = 'http://y.gtimg.cn/mediastyle/mod/mobile/img/logo.svg'

  const user = await UserModel.findOne({ username })
  if(user) {
    res.send({
      code: -1,
      msg: '用户名已存在'
    })
    return
  }
  const newUser = new UserModel({
    username,
    password: await bcryptjs.hash(password, 10),
    avatar
  })
  await newUser.save()

  res.send({
    code: 0,
    msg: '注册成功'
  })
})

// 获取当前登录用户的个人信息
app.get('/get_user_info', Auth, async (req, res) => {
  res.send({
    code: 0,
    msg: 'ok',
    data: {
      userInfo: req.userInfo
    }
  })
})
app.listen(3000)
