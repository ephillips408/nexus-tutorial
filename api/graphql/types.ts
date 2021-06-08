import { scalarType, objectType } from 'nexus'

export const uuidType = scalarType({
  name: 'UUID',
  serialize: (value) => value,
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: 'User' })
  },
})
