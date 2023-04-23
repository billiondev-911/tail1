/**
 * @since 1.0.0
 */
import type { RpcHandlers, RpcRouter } from "@effect/rpc/Router"
import type { Effect } from "@effect/io/Effect"
import type { Span } from "@effect/io/Tracer"
import * as internal from "@effect/rpc-webworkers/internal/server"

/**
 * @category models
 * @since 1.0.0
 */
export interface RpcWorkerHandler<R extends RpcRouter.Base> {
  (message: MessageEvent<any>): Effect<
    Exclude<RpcHandlers.Services<R["handlers"]>, Span>,
    never,
    void
  >
}

/**
 * @category models
 * @since 1.0.0
 */
export type RpcWorker<R extends RpcRouter.Base> = Effect<
  Exclude<RpcHandlers.Services<R["handlers"]>, Span>,
  never,
  never
>

/**
 * @category constructors
 * @since 1.0.0
 */
export const make: <Router extends RpcRouter.Base>(
  router: Router,
) => RpcWorker<Router> = internal.make as any

/**
 * @category constructors
 * @since 1.0.0
 */
export const makeHandler: <Router extends RpcRouter.Base>(
  router: Router,
) => RpcWorkerHandler<Router> = internal.makeHandler as any
