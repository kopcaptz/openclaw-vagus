import { describe, expect, it } from "vitest";
import { inferAuthChoiceFromFlags } from "./onboard-non-interactive/local/auth-choice-inference.js";

describe("inferAuthChoiceFromFlags", () => {
  it("infers qianfan auth choice from qianfan API key flag", () => {
    const inferred = inferAuthChoiceFromFlags({
      qianfanApiKey: "bce-v3/test",
    });

    expect(inferred.choice).toBe("qianfan-api-key");
    expect(inferred.matches).toHaveLength(1);
    expect(inferred.matches[0]?.label).toBe("--qianfan-api-key");
  });

  it("infers together auth choice from together API key flag", () => {
    const inferred = inferAuthChoiceFromFlags({
      togetherApiKey: "tg_test",
    });

    expect(inferred.choice).toBe("together-api-key");
    expect(inferred.matches).toHaveLength(1);
    expect(inferred.matches[0]?.label).toBe("--together-api-key");
  });

  it("marks result as ambiguous when multiple API key flags are provided", () => {
    const inferred = inferAuthChoiceFromFlags({
      togetherApiKey: "tg_test",
      qianfanApiKey: "bce-v3/test",
    });

    expect(inferred.choice).toBeUndefined();
    expect(inferred.matches.map((match) => match.label)).toEqual([
      "--together-api-key",
      "--qianfan-api-key",
    ]);
  });
});
