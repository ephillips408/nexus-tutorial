import { objectType, extendType, nonNull, stringArg } from 'nexus'

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
        return ctx.db.post.findMany({ where: { authorId: _root.id } || undefined })
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

        const user = {
          username: _args.username,
          email: _args.email,
          password: _args.password,
        }

        return ctx.db.user.create({ data: user })
      },
    })

    t.field('deleteUser', {
      type: 'User',
      args: {
        id: nonNull(stringArg()),
      },
      resolve(_root, _args, ctx) {
        return ctx.db.user.delete({ where: { id: _args.id } })
      },
    })
  },
})
