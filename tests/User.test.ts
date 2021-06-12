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
  expect(allUsersResult).toMatchInlineSnapshot()
})

it(`queries for a single user by id`, async () => {
  const singleUserResult = await ctx.client.request(`
  query {
    userById(id: "d5e48528-5a1b-4c19-bca6-64fece448e9e") {
      id
      username
      email
      posts {
        title
        body
        published
      }
    }
  }
  `)

  expect(singleUserResult).toMatchInlineSnapshot()
})