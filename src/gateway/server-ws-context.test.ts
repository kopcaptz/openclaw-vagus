import { describe, expect, test, vi } from "vitest";
import type { GatewayRuntimeContextSections } from "./server-ws-context.js";
import { buildGatewayRequestContext } from "./server-ws-context.js";

describe("buildGatewayRequestContext", () => {
  test("flattens grouped runtime sections into request context", () => {
    const sections: GatewayRuntimeContextSections = {
      infra: {
        deps: {} as never,
        cron: {} as never,
        cronStorePath: "/tmp/cron.json",
        loadGatewayModelCatalog: async () => [],
        logGateway: {} as never,
        broadcast: vi.fn(),
        broadcastToConnIds: vi.fn(),
        dedupe: new Map(),
      },
      health: {
        getHealthCache: () => null,
        refreshHealthSnapshot: async () => ({}) as never,
        logHealth: { error: vi.fn() },
        incrementPresenceVersion: () => 1,
        getHealthVersion: () => 1,
      },
      nodes: {
        nodeSendToSession: vi.fn(),
        nodeSendToAllSubscribed: vi.fn(),
        nodeSubscribe: vi.fn(),
        nodeUnsubscribe: vi.fn(),
        nodeUnsubscribeAll: vi.fn(),
        hasConnectedMobileNode: () => false,
        nodeRegistry: {} as never,
        broadcastVoiceWakeChanged: vi.fn(),
      },
      chat: {
        agentRunSeq: new Map(),
        chatAbortControllers: new Map(),
        chatAbortedRuns: new Map(),
        chatRunBuffers: new Map(),
        chatDeltaSentAt: new Map(),
        addChatRun: vi.fn(),
        removeChatRun: vi.fn(),
        registerToolEventRecipient: vi.fn(),
      },
      wizard: {
        wizardSessions: new Map(),
        findRunningWizard: () => null,
        purgeWizardSession: vi.fn(),
        wizardRunner: vi.fn(async () => {}),
      },
      channels: {
        getRuntimeSnapshot: () => ({ channels: {}, channelAccounts: {} }),
        startChannel: vi.fn(async () => {}),
        stopChannel: vi.fn(async () => {}),
        markChannelLoggedOut: vi.fn(),
      },
    };

    const context = buildGatewayRequestContext(sections);
    expect(context.cronStorePath).toBe("/tmp/cron.json");
    expect(context.getHealthVersion()).toBe(1);
    expect(context.hasConnectedMobileNode()).toBe(false);
    expect(context.getRuntimeSnapshot()).toEqual({ channels: {}, channelAccounts: {} });
  });
});
