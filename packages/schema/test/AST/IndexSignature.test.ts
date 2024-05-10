import * as AST from "@effect/schema/AST"
import { jestExpect as expect } from "@jest/expect"
import { describe, it } from "vitest"

describe("AST.IndexSignature", () => {
  it("new IndexSignature should throw on unsupported ASTs", () => {
    expect(() => new AST.IndexSignature(AST.booleanKeyword, AST.stringKeyword, true))
      .toThrow(
        new Error(
          "An index signature parameter type must be `string`, `symbol`, a template literal type or a refinement of the previous types"
        )
      )
  })
})
