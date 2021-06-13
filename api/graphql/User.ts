import { objectType, extendType, nonNull, stringArg } from 'nexus'
import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'

import { getUserId } from './utils'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('username')
    t.nonNull.string('email')
    t.nonNull.string('password')
    t.list.field('posts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({
          where: { authorId: _root.id } || undefined,
        })
      },
    })
  },
})

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('allUsers', {
      type: 'User',
      resolve(_root, _args, ctx) {
        return ctx.db.user.findMany()
      },
    })

    t.field('userById', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
      },
      resolve(_root, _args, ctx) {
        return ctx.db.user.findFirst({ where: { id: _args.id || undefined } })
      },
    })

    t.field('currentUser', {
      type: 'User',
      async resolve(_parent, _args, ctx) {
        const userId = getUserId(ctx)
        return ctx.db.user.findUnique({
          where: { id: String(userId) },
        })
      },
    })
  },
})

export const UserMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createUser', {
      type: 'User',
      args: {
        username: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_root, _args, ctx) {
        await ctx.db.user
          .findFirst({
            where: {
              email: {
                equals: _args.email,
              },
            },
          })
          .then((res) => {
            // This gives the email that is used in the createUser mutation.
            // If res !== null, then findFirst found a user with the email taken.
            if (res !== null) {
              throw new Error('Email already in use.')
            }
          })
          .catch((error) => {
            throw new Error(`${error}`)
          })

        const hashedPassword = await hash(_args.password, 10)

        const user = {
          username: _args.username,
          email: _args.email,
          password: hashedPassword,
        }

        return ctx.db.user.create({ data: user })
      },
    })

    t.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_parent, _args, ctx) {
        const user = await ctx.db.user.findUnique({
          where: {
            email: _args.email,
          },
        })

        if (!user) {
          throw new Error(`No user found with email ${_args.email}`)
        }

        const passwordValid = await compare(_args.password, user.password)

        if (!passwordValid) {
          throw new Error('Invalid password')
        }

        return {
          token: sign({ userId: user.id }, process.env.APP_SECRET as string),
          user,
        }
      },
    })

    t.field('deleteUser', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
      },
      resolve(_root, _args, ctx) {
        const userId = getUserId(ctx)

        if (_args.id !== userId) {
          throw new Error('Unauthorized User')
        }

        return ctx.db.user.delete({ where: { id: _args.id } })
      },
    })
  },
})
