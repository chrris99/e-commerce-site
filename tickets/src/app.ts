import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, RouteNotFoundError } from '@ccticketshop/shared'


// App
const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: true
    })
)

app.all('*', () => {
    throw new RouteNotFoundError('Route not found')
})

// Middlewares
app.use(errorHandler)

export { app }