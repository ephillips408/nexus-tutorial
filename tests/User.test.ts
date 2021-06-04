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