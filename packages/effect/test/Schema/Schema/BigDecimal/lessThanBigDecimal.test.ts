import { BigDecimal } from "effect"
import * as S from "effect/Schema"
import * as Util from "effect/test/Schema/TestUtils"
import { describe, it } from "vitest"

describe("lessThanBigDecimal", () => {
  const max = BigDecimal.fromNumber(5)
  const schema = S.BigDecimal.pipe(S.lessThanBigDecimal(max))

  it("decoding", async () => {
    await Util.expectDecodeUnknownFailure(
      schema,
      "5",
      `a BigDecimal less than 5
└─ Predicate refinement failure
   └─ Expected a BigDecimal less than 5, actual BigDecimal(5)`
    )
    await Util.expectDecodeUnknownFailure(
      schema,
      "6",
      `a BigDecimal less than 5
└─ Predicate refinement failure
   └─ Expected a BigDecimal less than 5, actual BigDecimal(6)`
    )
  })

  it("encoding", async () => {
    await Util.expectEncodeSuccess(schema, BigDecimal.fromNumber(4.5), "4.5")
  })
})
