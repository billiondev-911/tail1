import * as S from "@effect/schema/Schema"
import * as Util from "@effect/schema/test/TestUtils"
import { jestExpect as expect } from "@jest/expect"
import { describe, it } from "vitest"

describe("make", () => {
  it("should support lazy defaults", () => {
    let i = 0
    const schema = S.Struct({
      a: S.propertySignature(S.Number).pipe(S.withConstructorDefault(() => ++i))
    })
    expect(schema.make({})).toStrictEqual({ a: 1 })
    expect(schema.make({})).toStrictEqual({ a: 2 })
    schema.make({ a: 10 })
    expect(schema.make({})).toStrictEqual({ a: 3 })
  })

  it("required fields", () => {
    const schema = S.Struct({ a: S.String })
    Util.expectConstructorSuccess(schema, { a: "a" })
  })

  it("optional fields", () => {
    const schema = S.Struct({ a: S.optional(S.String) })
    Util.expectConstructorSuccess(schema, { a: "a" })
    Util.expectConstructorSuccess(schema, {})
  })

  it("props declarations with defaults (data last)", () => {
    const b = Symbol.for("b")
    const schema = S.Struct({
      a: S.String.pipe(S.propertySignature, S.withConstructorDefault(() => "")),
      [b]: S.Number.pipe(S.propertySignature, S.withConstructorDefault(() => 0))
    })
    Util.expectConstructorSuccess(schema, { a: "a", [b]: 2 })
    Util.expectConstructorSuccess(schema, { a: "a" }, { a: "a", [b]: 0 })
    Util.expectConstructorSuccess(schema, { [b]: 2 }, { a: "", [b]: 2 })
    Util.expectConstructorSuccess(schema, {}, { a: "", [b]: 0 })
  })

  it("props declarations with defaults (data first)", () => {
    const b = Symbol.for("b")
    const schema = S.Struct({
      a: S.withConstructorDefault(S.propertySignature(S.String), () => ""),
      [b]: S.withConstructorDefault(S.propertySignature(S.Number), () => 0)
    })
    Util.expectConstructorSuccess(schema, { a: "a", [b]: 2 })
    Util.expectConstructorSuccess(schema, { a: "a" }, { a: "a", [b]: 0 })
    Util.expectConstructorSuccess(schema, { [b]: 2 }, { a: "", [b]: 2 })
    Util.expectConstructorSuccess(schema, {}, { a: "", [b]: 0 })
  })

  it("props transformations with defaults (data last)", () => {
    const b = Symbol.for("b")
    const schema = S.Struct({
      a: S.String.pipe(S.optional({ default: () => "-" }), S.withConstructorDefault(() => "")),
      [b]: S.Number.pipe(S.optional({ default: () => -1 }), S.withConstructorDefault(() => 0))
    })
    Util.expectConstructorSuccess(schema, { a: "a", [b]: 2 })
    Util.expectConstructorSuccess(schema, { a: "a" }, { a: "a", [b]: 0 })
    Util.expectConstructorSuccess(schema, { [b]: 2 }, { a: "", [b]: 2 })
    Util.expectConstructorSuccess(schema, {}, { a: "", [b]: 0 })
  })
})
