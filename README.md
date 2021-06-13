## Nexus Tutorial Additions

This repo contains additions to the Nexus tutorial that is provided in the Nexus docs. The beginning of the tutorial can be found [here](https://nexusjs.org/docs/getting-started/tutorial). While creating this API, I found [this](https://github.com/prisma/prisma-examples/tree/latest/typescript/graphql-auth) repo helpful. There are obviously similarities between my additions and this repo.

Additions include the following:
* User model
* Connecting users to posts
* All user methods
* Password encryption
* User authentication

At this time, I have not written any tests for the added user or post methods.

To run this file, complete the following steps
1. Clone the repo
2. Install the dependencies with the following command:
```
npm install
```
3. Create the database with the following command
```
npx prisma migrate dev --name init
```
4. In the root directory, create a `.env` file, and add `APP_SECRET="yourchoiceofstring"`
5. Run the following command:
```
npm run dev
```
6. Navigate to [https://localhost:4000](https://localhost:4000) and create queries and mutations.

For methods that require user authorization, set the HTTP Header as follows
```json
{
  "Authorization": "Bearer __TOKEN__"
}
```