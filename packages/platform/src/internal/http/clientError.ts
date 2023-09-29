import type * as Error from "@effect/platform/Http/ClientError"
import * as Data from "effect/Data"

/** @internal */
export const TypeId: Error.TypeId = Symbol.for(
  "@effect/platform/Http/Error"
) as Error.TypeId

const make = <A extends Error.HttpClientError>(tag: A["_tag"]) => (props: Omit<A, Error.HttpError.ProvidedFields>): A =>
  Data.struct({
    [TypeId]: TypeId,
    _tag: tag,
    ...props
  } as A)

/** @internal */
export const requestError = make<Error.RequestError>("RequestError")

/** @internal */
export const responseError = make<Error.ResponseError>("ResponseError")
