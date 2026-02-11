import type { GatewayRequestContext } from "./server-methods/types.js";

export type GatewayRuntimeContextSections = {
  infra: Pick<
    GatewayRequestContext,
    | "deps"
    | "cron"
    | "cronStorePath"
    | "loadGatewayModelCatalog"
    | "logGateway"
    | "broadcast"
    | "broadcastToConnIds"
    | "dedupe"
  >;
  health: Pick<
    GatewayRequestContext,
    | "getHealthCache"
    | "refreshHealthSnapshot"
    | "logHealth"
    | "incrementPresenceVersion"
    | "getHealthVersion"
  >;
  nodes: Pick<
    GatewayRequestContext,
    | "nodeSendToSession"
    | "nodeSendToAllSubscribed"
    | "nodeSubscribe"
    | "nodeUnsubscribe"
    | "nodeUnsubscribeAll"
    | "hasConnectedMobileNode"
    | "nodeRegistry"
    | "broadcastVoiceWakeChanged"
  >;
  chat: Pick<
    GatewayRequestContext,
    | "agentRunSeq"
    | "chatAbortControllers"
    | "chatAbortedRuns"
    | "chatRunBuffers"
    | "chatDeltaSentAt"
    | "addChatRun"
    | "removeChatRun"
    | "registerToolEventRecipient"
  >;
  wizard: Pick<
    GatewayRequestContext,
    "wizardSessions" | "findRunningWizard" | "purgeWizardSession" | "wizardRunner"
  >;
  channels: Pick<
    GatewayRequestContext,
    "getRuntimeSnapshot" | "startChannel" | "stopChannel" | "markChannelLoggedOut"
  >;
};

export function buildGatewayRequestContext(
  sections: GatewayRuntimeContextSections,
): GatewayRequestContext {
  return {
    ...sections.infra,
    ...sections.health,
    ...sections.nodes,
    ...sections.chat,
    ...sections.wizard,
    ...sections.channels,
  };
}
