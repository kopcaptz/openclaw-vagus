import { describe, expect, test } from "vitest";
import { composeGatewayMethods } from "./server-gateway-methods.js";

describe("composeGatewayMethods", () => {
  test("dedupes methods while preserving first-seen order", () => {
    const methods = composeGatewayMethods(
      ["health", "status", "chat.send"],
      ["status", "channels.status", "chat.send"],
      ["agent", "channels.status"],
    );

    expect(methods).toEqual(["health", "status", "chat.send", "channels.status", "agent"]);
  });

  test("returns empty when all groups are empty", () => {
    expect(composeGatewayMethods([], [], [])).toEqual([]);
  });
});
