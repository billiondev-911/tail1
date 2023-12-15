/**
 * @since 1.0.0
 */
import type * as Schema from "@effect/schema/Schema"
import type * as Serializable from "@effect/schema/Serializable"
import type * as Context from "effect/Context"
import type * as Effect from "effect/Effect"
import type * as Layer from "effect/Layer"
import type * as Queue from "effect/Queue"
import type * as Scope from "effect/Scope"
import type * as Stream from "effect/Stream"
import * as internal from "./internal/workerRunner.js"
import type { WorkerError } from "./WorkerError.js"

/**
 * @since 1.0.0
 * @category models
 */
export interface BackingRunner<I, O> {
  readonly queue: Queue.Dequeue<I>
  readonly send: (message: O, transfers?: ReadonlyArray<unknown>) => Effect.Effect<never, never, void>
}

/**
 * @since 1.0.0
 * @category models
 */
export declare namespace BackingRunner {
  /**
   * @since 1.0.0
   * @category models
   */
  export type Message<I> = readonly [request: 0, I] | readonly [close: 1]
}

/**
 * @since 1.0.0
 * @category type ids
 */
export const PlatformRunnerTypeId: unique symbol = internal.PlatformRunnerTypeId

/**
 * @since 1.0.0
 * @category type ids
 */
export type PlatformRunnerTypeId = typeof PlatformRunnerTypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface PlatformRunner {
  readonly [PlatformRunnerTypeId]: PlatformRunnerTypeId
  readonly start: <I, O>() => Effect.Effect<Scope.Scope, WorkerError, BackingRunner<I, O>>
}

/**
 * @since 1.0.0
 * @category tags
 */
export const PlatformRunner: Context.Tag<PlatformRunner, PlatformRunner> = internal.PlatformRunner

/**
 * @since 1.0.0
 * @category models
 */
export declare namespace Runner {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Options<I, E, O> {
    readonly decode?: (message: unknown) => Effect.Effect<never, WorkerError, I>
    readonly encodeOutput?: (request: I, message: O) => Effect.Effect<never, WorkerError, unknown>
    readonly encodeError?: (request: I, error: E) => Effect.Effect<never, WorkerError, unknown>
    readonly transfers?: (message: O | E) => ReadonlyArray<unknown>
  }
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: <I, R, E, O>(
  process: (request: I) => Stream.Stream<R, E, O> | Effect.Effect<R, E, O>,
  options?: Runner.Options<I, E, O> | undefined
) => Effect.Effect<Scope.Scope | R | PlatformRunner, WorkerError, void> = internal.make

/**
 * @since 1.0.0
 * @category layers
 */
export const layer: <I, R, E, O>(
  process: (request: I) => Stream.Stream<R, E, O> | Effect.Effect<R, E, O>,
  options?: Runner.Options<I, E, O> | undefined
) => Layer.Layer<R | PlatformRunner, WorkerError, never> = internal.layer

/**
 * @since 1.0.0
 * @category constructors
 */
export const makeSerialized: <
  I,
  A extends Schema.TaggedRequest.Any,
  const Handlers extends {
    readonly [K in A["_tag"]]: Extract<A, { readonly _tag: K }> extends
      Serializable.SerializableWithResult<infer _IS, infer S, infer _IE, infer E, infer _IO, infer O>
      ? (_: S) => Stream.Stream<any, E, O> | Effect.Effect<any, E, O> :
      never
  }
>(
  schema: Schema.Schema<I, A>,
  handlers: Handlers
) => Effect.Effect<
  | PlatformRunner
  | Scope.Scope
  | (ReturnType<Handlers[keyof Handlers]> extends Stream.Stream<infer R, infer _E, infer _A> ? R : never),
  WorkerError,
  void
> = internal.makeSerialized

/**
 * @since 1.0.0
 * @category layers
 */
export const layerSerialized: <
  I,
  A extends Schema.TaggedRequest.Any,
  const Handlers extends {
    readonly [K in A["_tag"]]: Extract<A, { readonly _tag: K }> extends
      Serializable.SerializableWithResult<infer _IS, infer S, infer _IE, infer E, infer _IO, infer O>
      ? (_: S) => Stream.Stream<any, E, O> | Effect.Effect<any, E, O> :
      never
  }
>(
  schema: Schema.Schema<I, A>,
  handlers: Handlers
) => Layer.Layer<
  | PlatformRunner
  | (ReturnType<Handlers[keyof Handlers]> extends Stream.Stream<infer R, infer _E, infer _A> ? R : never),
  WorkerError,
  never
> = internal.layerSerialized
