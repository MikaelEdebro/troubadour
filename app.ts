import express, { Request, Response } from 'express'
import path from 'path'
import keys from './config/keys'
import passport from 'passport'
import cookieSession from 'cookie-session'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import handleErrorMiddleware from './middlewares/handleError'
import { authController, userController, songController, playlistController } from './controllers'

// mongoose config
if (process.env.NODE_ENV !== 'test') {
  const mongoose = require('mongoose')
  mongoose.Promise = global.Promise
  mongoose.connect(keys.mongoURI, {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  })
}

// passport config
require('./config/passport')

const app = express()
app.use(helmet())
app.use(bodyParser.json())
app.use(
  cookieSession({
    name: 'kdkd',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
)
app.use(passport.initialize())
app.use(passport.session())

// sanitize req.body to prevent operator injection
app.use(mongoSanitize())

// controllers
app.use('/api', authController, userController, songController, playlistController)

// serve up react app in prod
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.use(handleErrorMiddleware)

export default app