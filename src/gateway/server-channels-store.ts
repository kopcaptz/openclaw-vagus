import type { ChannelAccountSnapshot, ChannelId } from "../channels/plugins/types.js";
import type { ChannelRuntimeStore } from "./server-channels.types.js";

export type ChannelRuntimeStoreAccessors = {
  channelStores: Map<ChannelId, ChannelRuntimeStore>;
  getStore: (channelId: ChannelId) => ChannelRuntimeStore;
  getRuntime: (channelId: ChannelId, accountId: string) => ChannelAccountSnapshot;
  setRuntime: (
    channelId: ChannelId,
    accountId: string,
    patch: ChannelAccountSnapshot,
  ) => ChannelAccountSnapshot;
};

function createRuntimeStore(): ChannelRuntimeStore {
  return {
    aborts: new Map(),
    tasks: new Map(),
    runtimes: new Map(),
  };
}

export function createChannelRuntimeStoreAccessors(params: {
  resolveDefaultRuntime: (channelId: ChannelId, accountId: string) => ChannelAccountSnapshot;
}): ChannelRuntimeStoreAccessors {
  const channelStores = new Map<ChannelId, ChannelRuntimeStore>();

  const getStore = (channelId: ChannelId): ChannelRuntimeStore => {
    const existing = channelStores.get(channelId);
    if (existing) {
      return existing;
    }
    const next = createRuntimeStore();
    channelStores.set(channelId, next);
    return next;
  };

  const getRuntime = (channelId: ChannelId, accountId: string): ChannelAccountSnapshot => {
    const store = getStore(channelId);
    return store.runtimes.get(accountId) ?? params.resolveDefaultRuntime(channelId, accountId);
  };

  const setRuntime = (
    channelId: ChannelId,
    accountId: string,
    patch: ChannelAccountSnapshot,
  ): ChannelAccountSnapshot => {
    const store = getStore(channelId);
    const current = getRuntime(channelId, accountId);
    const next = { ...current, ...patch, accountId };
    store.runtimes.set(accountId, next);
    return next;
  };

  return {
    channelStores,
    getStore,
    getRuntime,
    setRuntime,
  };
}
