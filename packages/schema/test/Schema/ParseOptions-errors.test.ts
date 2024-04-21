import * as S from "@effect/schema/Schema"
import * as Util from "@effect/schema/test/TestUtils"
import { describe, it } from "vitest"

describe("`errors` option", () => {
  describe("decoding", () => {
    describe("tuple", () => {
      it("e r e", async () => {
        const schema = S.Tuple([S.String], S.Number, S.Boolean)
        await Util.expectDecodeUnknownFailure(
          schema,
          [true],
          `readonly [string, ...number[], boolean]
├─ [1]
│  └─ is missing
└─ [0]
   └─ Expected a string, actual true`,
          Util.allErrors
        )
      })

      it("missing element", async () => {
        const schema = S.Tuple(S.String, S.Number)
        await Util.expectDecodeUnknownFailure(
          schema,
          [],
          `readonly [string, number]
├─ [0]
│  └─ is missing
└─ [1]
   └─ is missing`,
          Util.allErrors
        )
      })

      it("unexpected indexes", async () => {
        const schema = S.Tuple()
        await Util.expectDecodeUnknownFailure(
          schema,
          ["a", "b"],
          `readonly []
├─ [0]
│  └─ is unexpected, expected never
└─ [1]
   └─ is unexpected, expected never`,
          Util.allErrors
        )
      })

      it("wrong type for elements", async () => {
        const schema = S.Tuple(S.String, S.Number)
        await Util.expectDecodeUnknownFailure(
          schema,
          [1, "b"],
          `readonly [string, number]
├─ [0]
│  └─ Expected a string, actual 1
└─ [1]
   └─ Expected a number, actual "b"`,
          Util.allErrors
        )
      })

      it("wrong type for rest", async () => {
        const schema = S.Tuple([S.String], S.Number)
        await Util.expectDecodeUnknownFailure(
          schema,
          ["a", "b", "c"],
          `readonly [string, ...number[]]
├─ [1]
│  └─ Expected a number, actual "b"
└─ [2]
   └─ Expected a number, actual "c"`,
          Util.allErrors
        )
      })

      it("wrong type for post rest elements", async () => {
        const schema = S.Tuple([], S.Boolean, S.Number, S.Number)
        await Util.expectDecodeUnknownFailure(
          schema,
          ["a", "b"],
          `readonly [...boolean[], number, number]
├─ [0]
│  └─ Expected a number, actual "a"
└─ [1]
   └─ Expected a number, actual "b"`,
          Util.allErrors
        )
      })
    })

    describe("struct", () => {
      it("missing keys", async () => {
        const schema = S.Struct({ a: S.String, b: S.Number })
        await Util.expectDecodeUnknownFailure(
          schema,
          {},
          `{ a: string; b: number }
├─ ["a"]
│  └─ is missing
└─ ["b"]
   └─ is missing`,
          Util.allErrors
        )
      })

      it("wrong type for values", async () => {
        const schema = S.Struct({ a: S.String, b: S.Number })
        await Util.expectDecodeUnknownFailure(
          schema,
          { a: 1, b: "b" },
          `{ a: string; b: number }
├─ ["a"]
│  └─ Expected a string, actual 1
└─ ["b"]
   └─ Expected a number, actual "b"`,
          Util.allErrors
        )
      })

      it("unexpected keys", async () => {
        const schema = S.Struct({ a: S.Number })
        await Util.expectDecodeUnknownFailure(
          schema,
          { a: 1, b: "b", c: "c" },
          `{ a: number }
├─ ["b"]
│  └─ is unexpected, expected "a"
└─ ["c"]
   └─ is unexpected, expected "a"`,
          { ...Util.allErrors, ...Util.onExcessPropertyError }
        )
      })
    })

    describe("record", () => {
      it("all key errors", async () => {
        const schema = S.Record(S.String.pipe(S.minLength(2)), S.Number)
        await Util.expectDecodeUnknownFailure(
          schema,
          { a: 1, b: 2 },
          `{ [x: string]: number }
├─ ["a"]
│  └─ is unexpected, expected a string at least 2 character(s) long
└─ ["b"]
   └─ is unexpected, expected a string at least 2 character(s) long`,
          { ...Util.allErrors, ...Util.onExcessPropertyError }
        )
      })

      it("all value errors", async () => {
        const schema = S.Record(S.String, S.Number)
        await Util.expectDecodeUnknownFailure(
          schema,
          { a: "a", b: "b" },
          `{ [x: string]: number }
├─ ["a"]
│  └─ Expected a number, actual "a"
└─ ["b"]
   └─ Expected a number, actual "b"`,
          Util.allErrors
        )
      })
    })
  })

  describe("encoding", () => {
    describe("tuple", () => {
      it("unexpected indexes", async () => {
        const schema = S.Tuple()
        await Util.expectEncodeFailure(
          schema,
          [1, 1] as any,
          `readonly []
├─ [0]
│  └─ is unexpected, expected never
└─ [1]
   └─ is unexpected, expected never`,
          Util.allErrors
        )
      })

      it("wrong type for elements", async () => {
        const schema = S.Tuple(Util.NumberFromChar, Util.NumberFromChar)
        await Util.expectEncodeFailure(
          schema,
          [10, 10],
          `readonly [NumberFromChar, NumberFromChar]
├─ [0]
│  └─ NumberFromChar
│     └─ Encoded side transformation failure
│        └─ Char
│           └─ Predicate refinement failure
│              └─ Expected Char (a single character), actual "10"
└─ [1]
   └─ NumberFromChar
      └─ Encoded side transformation failure
         └─ Char
            └─ Predicate refinement failure
               └─ Expected Char (a single character), actual "10"`,
          Util.allErrors
        )
      })

      it("wrong type for rest", async () => {
        const schema = S.Array(Util.NumberFromChar)
        await Util.expectEncodeFailure(
          schema,
          [10, 10],
          `ReadonlyArray<NumberFromChar>
├─ [0]
│  └─ NumberFromChar
│     └─ Encoded side transformation failure
│        └─ Char
│           └─ Predicate refinement failure
│              └─ Expected Char (a single character), actual "10"
└─ [1]
   └─ NumberFromChar
      └─ Encoded side transformation failure
         └─ Char
            └─ Predicate refinement failure
               └─ Expected Char (a single character), actual "10"`,
          Util.allErrors
        )
      })

      it("wrong type for values post rest elements", async () => {
        const schema = S.Tuple([], S.String, Util.NumberFromChar, Util.NumberFromChar)
        await Util.expectEncodeFailure(
          schema,
          [10, 10],
          `readonly [...string[], NumberFromChar, NumberFromChar]
├─ [0]
│  └─ NumberFromChar
│     └─ Encoded side transformation failure
│        └─ Char
│           └─ Predicate refinement failure
│              └─ Expected Char (a single character), actual "10"
└─ [1]
   └─ NumberFromChar
      └─ Encoded side transformation failure
         └─ Char
            └─ Predicate refinement failure
               └─ Expected Char (a single character), actual "10"`,
          Util.allErrors
        )
      })
    })

    describe("struct", () => {
      it("wrong type for values", async () => {
        const schema = S.Struct({ a: Util.NumberFromChar, b: Util.NumberFromChar })
        await Util.expectEncodeFailure(
          schema,
          { a: 10, b: 10 },
          `{ a: NumberFromChar; b: NumberFromChar }
├─ ["a"]
│  └─ NumberFromChar
│     └─ Encoded side transformation failure
│        └─ Char
│           └─ Predicate refinement failure
│              └─ Expected Char (a single character), actual "10"
└─ ["b"]
   └─ NumberFromChar
      └─ Encoded side transformation failure
         └─ Char
            └─ Predicate refinement failure
               └─ Expected Char (a single character), actual "10"`,
          Util.allErrors
        )
      })
    })

    describe("record", () => {
      it("all key errors", async () => {
        const schema = S.Record(S.Char, S.String)
        await Util.expectEncodeFailure(
          schema,
          { aa: "a", bb: "bb" },
          `{ [x: string]: string }
├─ ["aa"]
│  └─ is unexpected, expected Char (a single character)
└─ ["bb"]
   └─ is unexpected, expected Char (a single character)`,
          { ...Util.allErrors, ...Util.onExcessPropertyError }
        )
      })

      it("all value errors", async () => {
        const schema = S.Record(S.String, S.Char)
        await Util.expectEncodeFailure(
          schema,
          { a: "aa", b: "bb" },
          `{ [x: string]: Char }
├─ ["a"]
│  └─ Char
│     └─ Predicate refinement failure
│        └─ Expected Char (a single character), actual "aa"
└─ ["b"]
   └─ Char
      └─ Predicate refinement failure
         └─ Expected Char (a single character), actual "bb"`,
          Util.allErrors
        )
      })
    })
  })
})
