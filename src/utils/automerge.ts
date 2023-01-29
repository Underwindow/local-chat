import * as Automerge from '@automerge/automerge'
import { localStorageJSON } from '@/utils/storage'

export function updateDoc<T>(newDoc: Automerge.Doc<T>, channel: BroadcastChannel) {
  let binary = Automerge.save(newDoc)
  localStorageJSON.setItem(channel.name, Array.from(binary))
  channel.postMessage(binary)
}