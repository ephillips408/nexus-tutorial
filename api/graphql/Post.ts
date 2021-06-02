import { objectType, extendType, stringArg, nonNull, intArg } from 'nexus'

export const Post = objectType({
  name: 'Post',            
  definition(t) {
    t.int('id')            
    t.string('title')      
    t.string('body')       
    t.boolean('published')
    t.field('author', {
      type: 'User',
      resolve(_root, _args, ctx) {
        return ctx.db.user.findUnique({ where: { id: _root.id || undefined} })
      }
    })
  },
})

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('drafts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { published: false } })
      }
    })
    t.list.field('posts', {
      type: 'Post',
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { published: true } })
      }
    })
  },
})

export const PostMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createDraft', {
      type: 'Post',
      args: {
        authorId: nonNull(intArg()),
        title: nonNull(stringArg()),
        body: nonNull(stringArg())
      },
      resolve(_root, args, ctx) {
        const draft = {
          authorId: args.authorId,
          title: args.title,
          body: args.body,
          published: false,
        }
        return ctx.db.post.create({ data: draft })
      }
    })

    t.field('publish', {
      type: 'Post',
      args: {
        draftId: nonNull(intArg())
      },
      resolve(_root, args, ctx) {
        return ctx.db.post.update({
          where: { id: args.draftId },
          data: {
            published: true
          }
        })
      }
    })

    t.field('deletePost', {
      type: 'Post',
      args: {
        id: nonNull(intArg())
      },
      resolve(_, args, ctx) {
        return ctx.db.post.delete({ where: { id: args.id } })
      }
    })
  }
})


