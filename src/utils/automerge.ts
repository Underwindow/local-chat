import * as Automerge from '@automerge/automerge'
import { localStorage } from '@/utils/storage'

export function updateDoc<T>(newDoc: Automerge.Doc<T>, channel: BroadcastChannel) {
  let binary = Automerge.save(newDoc)
  localStorage.setItem(channel.name, binary)
  channel.postMessage(binary)
}