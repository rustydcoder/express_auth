# MERN-AUTH

A very simple auth template for node/express applications with a no-sql db(Mongodb)

### Simple Steps To Create Your Own Express Auth Boilerplate

1. Download the required dependencies, see [/server/package.json](https://github.com/rustydcoder/mern-auth/blob/main/server/package.json) with `npm install`.
2. Set up express server as seen in [/server/index.js](https://github.com/rustydcoder/mern-auth/blob/main/server/index.js)
3. Connect to mongodb via preferred mongodb client, and create model
4. Apply middlewares on your express server and create your routes
5. And setup controllers to handle the logic of each route
6. Using your db model, hash your password saved on db (best practices principle).
