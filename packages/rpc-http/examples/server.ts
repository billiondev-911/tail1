import * as Http from "@effect/platform-node/HttpServer"
import { runMain } from "@effect/platform-node/Runtime"
import * as Router from "@effect/rpc-http/Router"
import * as Server from "@effect/rpc-http/Server"
import { Chunk, Console, Effect } from "effect"
import { createServer } from "http"
import { schema, UserId } from "./schema"

// Implement the RPC server router
const router = Router.make(schema, {
  getUserIds: Effect.succeed(Chunk.map(Chunk.range(1, 100), UserId)),
  getUser: (id) => Effect.succeed({ id, name: `User ${id}` })
})

const server = Http.router.empty.pipe(
  Http.router.post("/rpc", Server.make(router)),
  Http.server.serve(Http.middleware.logger),
  Effect.scoped
)

// Create the HTTP, which can be served with the platform HTTP server.
Console.log("Listening on http://localhost:3000").pipe(
  Effect.zipRight(server),
  Effect.provide(Http.server.layer(createServer, {
    port: 3000
  })),
  Effect.tapErrorCause(Effect.logError),
  runMain
)
