import { createTestContext } from './__helpers'

const ctx = createTestContext()

it('ensures that a draft can be created and published', async () => {
  // Create a new draft
  const draftResult = await ctx.client.request(`
    mutation {
      createDraft(
        authorId: "d5e48528-5a1b-4c19-bca6-64fece448e9e"
        title: "Nexus", 
        body: "...") {
          id
          title
          body
          published
      }
    }
  `)

  // Snapshot that draft and expected 'published' to be false
  expect(draftResult).toMatchInlineSnapshot()

  // Publish the previously created draft
  const publishResult = await ctx.client.request(`
    mutation publishDraft($draftId: String!) {
      publish(draftId: $draftId) {
        id
        title
        body
        published
      }
    }
  `,
    { draftId: draftResult.createDraft.id }
  )

  // Snapshot the published draft and expect 'published' to be true
  expect(publishResult).toMatchInlineSnapshot()

  const persistedData = await ctx.db.post.findMany()

  expect(persistedData).toMatchInlineSnapshot()
})