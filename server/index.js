const { ApolloServer } = require("@apollo/server"); //import from Apollo server
const { startStandaloneServer } = require("@apollo/server/standalone");
// const { startServerAndCreateNextHandler } = require("@as-integrations/next");
const glob = require("glob");
const { mergeResolvers, mergeTypeDefs } = require("@graphql-tools/merge");
const jwt = require("jsonwebtoken");

//? importing types and resolvers
const resolvers = glob.sync("graphql/*/*-resolver.js");
const types = glob.sync("graphql/*/*-type.js");
const registerResolvers = resolvers.map((resolver) => require(`./${resolver}`));
const registerTypes = types.map((type) => require(`./${type}`));

//? merging types and resolvers
const typeDefsMerged = mergeTypeDefs(registerTypes);
const resolversMerged = mergeResolvers(registerResolvers);

//importing connection
//after making connection on the folder connection file, make const connection (1a)
const { connection } = require("./helpers/connection");
require("dotenv").config();
//import config(1c) // Get appPrivateKey and dbConnectionString from config
const config = require("config");
const { func } = require("joi");
const appPrivateKey = config.get("appPrivateKey");
//importing connection string from config file(1c)
const dbConnectionString = config.get("db.connectionString");

// Check that appPrivateKey and dbConnectionString are defined
if (!appPrivateKey || !dbConnectionString) {
  console.error(
    "FATAL ERROR: APP_PRIVATE_KEY is not defined and or DB_CONNECTION_STRING is not defined"
  );
  process.exit(1);
}

async function startServer() {
  const server = new ApolloServer({
    typeDefs: typeDefsMerged,
    resolvers: resolversMerged,
    introspection: true,
  });

  connection(dbConnectionString + "restaurants"); //connected to mongodb and then making this connection (1b)

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4005 },
    context: async function ({ req, res }) {
      try {
        const token = req.headers.authorization || "";
        if (!token) return;
        const user = jwt.verify(token, appPrivateKey);
        if (!user) {
          throw new Error("Invalid token");
        }
        return { user };
      } catch (error) {
        throw new GraphQLError(
          `Failed to authenticate user: ${error.message}`,
          {
            extensions: { code: "AUTHENTICATION_ERROR" },
            status: 401,
          }
        );
      }
    },
  });
  console.log(`Server ready at: ${url}`);
}

startServer();
