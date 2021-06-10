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
    "id": "3ce65793-5695-4fdf-b482-38b4455dc959",
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
    "id": "3ce65793-5695-4fdf-b482-38b4455dc959",
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
    "body": "...",
    "id": "6ae33938-fe49-45a0-ac56-2bbc12ee48ff",
    "published": true,
    "title": "Nexus",
  },
  Object {
    "authorId": "f59aa33b-5852-4039-b996-e34558e5b97e",
    "body": "This post is by the first user",
    "id": "09551607-d891-4963-b28d-fce88d984cf8",
    "published": true,
    "title": "User One Post",
  },
  Object {
    "authorId": "d5e48528-5a1b-4c19-bca6-64fece448e9e",
    "body": "...",
    "id": "dfbb1f7e-1f6a-4529-a03b-b53a7cf4770f",
    "published": true,
    "title": "Nexus",
  },
  Object {
    "authorId": "d5e48528-5a1b-4c19-bca6-64fece448e9e",
    "body": "...",
    "id": "3ce65793-5695-4fdf-b482-38b4455dc959",
    "published": true,
    "title": "Nexus",
  },
]
`)
})