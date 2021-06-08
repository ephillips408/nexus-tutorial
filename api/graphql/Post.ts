import { objectType, extendType, stringArg, nonNull } from 'nexus'
import { resolveImportPath } from 'nexus/dist/utils'

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.string('id')
    t.string('title')
    t.string('body')
    t.boolean('published')
    t.string('authorId')
    t.field('author', {
      type: 'User',
      resolve(_root, _args, ctx) {
        return ctx.db.user.findFirst({
          where: { id: _root.authorId || undefined },
        })
      },
    })
  },
})

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('allDrafts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { published: false } })
      },
    })

    t.list.field('allPosts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { published: true } })
      },
    })

    t.list.field('searchPosts', {
      type: 'Post',
      args: {
        searchString: nonNull(stringArg()),
      },
      resolve(_root, { searchString }, ctx) {
        const or = searchString.toLowerCase()
          ? {
              OR: [
                { title: { contains: searchString } },
                { body: { contains: searchString } },
              ],
            }
          : {}
        return ctx.db.post.findMany({
          where: {
            published: true,
            ...or,
          },
        })
      },
    })
  },
})

export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createDraft', {
      type: 'Post',
      args: {
        authorId: nonNull(stringArg()),
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        const draft = {
          authorId: args.authorId,
          title: args.title,
          body: args.body,
          published: false,
        }
        return ctx.db.post.create({ data: draft })
      },
    })

    t.field('publish', {
      type: 'Post',
      args: {
        draftId: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        return ctx.db.post.update({
          where: { id: args.draftId },
          data: {
            published: true,
          },
        })
      },
    })

    t.field('deletePost', {
      type: 'Post',
      args: {
        id: nonNull(stringArg()),
      },
      resolve(_, args, ctx) {
        return ctx.db.post.delete({ where: { id: args.id } })
      },
    })
  },
})
