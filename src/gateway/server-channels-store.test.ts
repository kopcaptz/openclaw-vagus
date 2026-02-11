import { describe, expect, test } from "vitest";
import type { ChannelId } from "../channels/plugins/types.js";
import { createChannelRuntimeStoreAccessors } from "./server-channels-store.js";

describe("createChannelRuntimeStoreAccessors", () => {
  test("initializes defaults per channel/account and keeps stores isolated", () => {
    const accessors = createChannelRuntimeStoreAccessors({
      resolveDefaultRuntime: (_channelId, accountId) => ({
        accountId,
        running: false,
        lastError: null,
      }),
    });

    const telegram = "telegram" as ChannelId;
    const slack = "slack" as ChannelId;

    expect(accessors.getRuntime(telegram, "default")).toEqual({
      accountId: "default",
      running: false,
      lastError: null,
    });

    accessors.setRuntime(telegram, "default", {
      accountId: "default",
      running: true,
      lastError: null,
    });

    expect(accessors.getRuntime(telegram, "default").running).toBe(true);
    expect(accessors.getRuntime(slack, "default").running).toBe(false);
  });

  test("setRuntime merges patch values on top of current status", () => {
    const accessors = createChannelRuntimeStoreAccessors({
      resolveDefaultRuntime: (_channelId, accountId) => ({
        accountId,
        running: false,
      }),
    });
    const whatsapp = "whatsapp" as ChannelId;

    accessors.setRuntime(whatsapp, "acc1", {
      accountId: "acc1",
      running: true,
      connected: true,
    });
    accessors.setRuntime(whatsapp, "acc1", {
      accountId: "acc1",
      running: false,
      lastError: "logged out",
    });

    expect(accessors.getRuntime(whatsapp, "acc1")).toEqual({
      accountId: "acc1",
      running: false,
      connected: true,
      lastError: "logged out",
    });
  });
});
