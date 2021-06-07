import { createTestContext } from './__helpers'

const ctx = createTestContext()

it(`queries for all users`, async () => {
  // Query for the users
  const allUsersResult = await ctx.client.request(`
  query {
    allUsers {
      id
      username
      email
      posts {
        id
        title
      }
    }
  }
  `)

  // Snapshot of the result from the query.
  expect(allUsersResult).toMatchInlineSnapshot(`
Object {
  "allUsers": Array [
    Object {
      "email": "uuid@example.com",
      "id": "d5e48528-5a1b-4c19-bca6-64fece448e9e",
      "posts": Array [
        Object {
          "id": "78de34fa-8b7a-4731-ba77-f549537518fd",
          "title": "Hello Post",
        },
        Object {
          "id": "0dc4b619-f514-49f8-937a-d047168fa27f",
          "title": "Hello Second Post",
        },
        Object {
          "id": "f9714ef7-b84a-4e60-bfe2-ee4bdf0ef59d",
          "title": "Nexus",
        },
        Object {
          "id": "624db3e0-8643-4204-a27d-9f0bf30a287e",
          "title": "Nexus",
        },
      ],
      "username": "User New UUID",
    },
    Object {
      "email": "first@example.com",
      "id": "f59aa33b-5852-4039-b996-e34558e5b97e",
      "posts": Array [],
      "username": "User One",
    },
    Object {
      "email": "second@example.com",
      "id": "5533e475-9c9f-444c-8df5-f75099249cad",
      "posts": Array [],
      "username": "User Two",
    },
  ],
}
`)
})