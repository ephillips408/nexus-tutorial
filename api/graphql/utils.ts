// Work in progress

import { verify } from 'jsonwebtoken'
import { Context } from '../context'

// export const APP_SECRET = process.env.APP_SECRET - need to access this somehow

interface Token {
  userId: string
}