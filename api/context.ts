import { db } from './db'
import { PrismaClient } from '@prisma/client'

export interface Context {
  db: PrismaClient
  req: any // HTTP Request carrying the 'Authorization' header
}

export function createContext(req: any) {
  return {
    db,
    ...req
  }
}
