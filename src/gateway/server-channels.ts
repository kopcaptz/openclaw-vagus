import type { ChannelAccountSnapshot, ChannelId } from "../channels/plugins/types.js";
import type { ChannelManager, ChannelManagerOptions } from "./server-channels.types.js";
import { getChannelPlugin } from "../channels/plugins/index.js";
import { DEFAULT_ACCOUNT_ID } from "../routing/session-key.js";
import { createChannelLifecycleService } from "./server-channels-lifecycle.js";
import { createChannelStatusProjection } from "./server-channels-status.js";
import { createChannelRuntimeStoreAccessors } from "./server-channels-store.js";

function isAccountEnabled(account: unknown): boolean {
  if (!account || typeof account !== "object") {
    return true;
  }
  const enabled = (account as { enabled?: boolean }).enabled;
  return enabled !== false;
}

function resolveDefaultRuntime(channelId: ChannelId): ChannelAccountSnapshot {
  const plugin = getChannelPlugin(channelId);
  return plugin?.status?.defaultRuntime ?? { accountId: DEFAULT_ACCOUNT_ID };
}

function cloneDefaultRuntime(channelId: ChannelId, accountId: string): ChannelAccountSnapshot {
  return { ...resolveDefaultRuntime(channelId), accountId };
}

export type {
  ChannelManager,
  ChannelManagerOptions,
  ChannelRuntimeSnapshot,
} from "./server-channels.types.js";

// Channel docking: lifecycle hooks (`plugin.gateway`) flow through this manager.
export function createChannelManager(opts: ChannelManagerOptions): ChannelManager {
  const { loadConfig, channelLogs, channelRuntimeEnvs } = opts;
  const runtimeStores = createChannelRuntimeStoreAccessors({
    resolveDefaultRuntime: cloneDefaultRuntime,
  });
  const lifecycle = createChannelLifecycleService({
    loadConfig,
    channelLogs,
    channelRuntimeEnvs,
    getStore: runtimeStores.getStore,
    getRuntime: runtimeStores.getRuntime,
    setRuntime: runtimeStores.setRuntime,
    isAccountEnabled,
  });
  const statusProjection = createChannelStatusProjection({
    loadConfig,
    getStore: runtimeStores.getStore,
    resolveDefaultRuntime: cloneDefaultRuntime,
    isAccountEnabled,
  });

  return {
    getRuntimeSnapshot: statusProjection.getRuntimeSnapshot,
    startChannels: lifecycle.startChannels,
    startChannel: lifecycle.startChannel,
    stopChannel: lifecycle.stopChannel,
    markChannelLoggedOut: lifecycle.markChannelLoggedOut,
  };
}
