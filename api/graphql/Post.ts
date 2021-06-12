import { objectType, extendType, stringArg, nonNull } from 'nexus'
import { resolveImportPath } from 'nexus/dist/utils'
import { Context } from '../context'
import { getUserId } from './utils'

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
      resolve(_root, _args, ctx) {
        const userId = getUserId(ctx)

        if (userId !== _args.authorId) {
          throw new Error('Unauthorized User!')
        }

        const draft = {
          authorId: _args.authorId,
          title: _args.title,
          body: _args.body,
          published: false,
        }

        return ctx.db.post.create({ data: draft })
      },
    })

    t.field('publish', {
      type: 'Post',
      args: {
        userId: nonNull(stringArg()),
        draftId: nonNull(stringArg()),
      },
      async resolve(_root, _args, ctx) {
        const post = await ctx.db.post.findFirst({
          where: {
            id: _args.draftId,
            authorId: _args.userId
          }
        })

        const postAuthor = getUserId(ctx)

        if (post?.authorId !== _args.userId) {
          throw new Error('Unauthorized User!')
        }

        return ctx.db.post.update({
          where: { id: _args.draftId },
          data: {
            published: true,
          },
        })
      },
    })

    t.field('deletePost', {
      type: 'Post',
      args: {
        userId: nonNull(stringArg()),
        postId: nonNull(stringArg()),
      },
      async resolve(_, _args, ctx) {
        const post = await ctx.db.post.findFirst({
          where: {
            id: _args.postId,
            authorId: _args.userId
          }
        })
        
        const postAuthor = getUserId(ctx)

        if (post?.authorId !== postAuthor) {
          // Trying to delete the same post twice still gives this error.
          throw new Error('Unauthorized User!')
        }

        return ctx.db.post.delete({ where: { id: _args.postId } })
      },
    })
  },
})
