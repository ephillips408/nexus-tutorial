import { objectType, extendType, nonNull, stringArg } from 'nexus'
import { Post } from './Post'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.string('username')
    t.nonNull.string('email')
    t.nonNull.string('password')
    t.list.field('posts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { id: _root.id } || undefined })
      }
    })
  }
})

export const UserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createUser', {
      type: 'User',
      args: {
        username: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve(_root, _args, ctx) {
        const user = {
          username: _args.username,
          email: _args.email,
          password: _args.password
        }
        return ctx.db.user.create({ data: user })
      }
    })
  }
})