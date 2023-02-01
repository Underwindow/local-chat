import * as Automerge from '@automerge/automerge';
import { StorageJSON, localStorageJSON } from '@/utils/storage';

export function updateDoc<TDoc>(
  newDoc: Automerge.Doc<TDoc>,
  channel: BroadcastChannel
) {
  const binary = Automerge.save(newDoc);
  localStorageJSON.setItem(channel.name, Array.from(binary));
  channel.postMessage(binary);
}

export function loadDoc<TDoc>(
  storage: StorageJSON,
  keyNane: string,
  onSuccess: (doc: Automerge.Doc<TDoc>) => void
) {
  const chatRoomBinaryArr = storage.getItem<[]>(keyNane) ?? [];
  const chatRoomBinary = new Uint8Array(chatRoomBinaryArr);
  onSuccess(Automerge.load<TDoc>(chatRoomBinary));
}
