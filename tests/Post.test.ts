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
  expect(draftResult).toMatchInlineSnapshot(`
Object {
  "createDraft": Object {
    "body": "...",
    "id": "6ae33938-fe49-45a0-ac56-2bbc12ee48ff",
    "published": false,
    "title": "Nexus",
  },
}
`)

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
  expect(publishResult).toMatchInlineSnapshot(`
Object {
  "publish": Object {
    "body": "...",
    "id": "6ae33938-fe49-45a0-ac56-2bbc12ee48ff",
    "published": true,
    "title": "Nexus",
  },
}
`)

  const persistedData = await ctx.db.post.findMany()

  expect(persistedData).toMatchInlineSnapshot(`
Array [
  Object {
    "authorId": "d5e48528-5a1b-4c19-bca6-64fece448e9e",
    "body": "New hello post",
    "id": "78de34fa-8b7a-4731-ba77-f549537518fd",
    "published": true,
    "title": "Hello Post",
  },
  Object {
    "authorId": "d5e48528-5a1b-4c19-bca6-64fece448e9e",
    "body": "Second post",
    "id": "0dc4b619-f514-49f8-937a-d047168fa27f",
    "published": false,
    "title": "Hello Second Post",
  },
  Object {
    "authorId": "d5e48528-5a1b-4c19-bca6-64fece448e9e",
    "body": "...",
    "id": "f9714ef7-b84a-4e60-bfe2-ee4bdf0ef59d",
    "published": false,
    "title": "Nexus",
  },
  Object {
    "authorId": "d5e48528-5a1b-4c19-bca6-64fece448e9e",
    "body": "...",
    "id": "624db3e0-8643-4204-a27d-9f0bf30a287e",
    "published": false,
    "title": "Nexus",
  },
  Object {
    "authorId": "d5e48528-5a1b-4c19-bca6-64fece448e9e",
    "body": "...",
    "id": "6ae33938-fe49-45a0-ac56-2bbc12ee48ff",
    "published": true,
    "title": "Nexus",
  },
]
`)
})