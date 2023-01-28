import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { store } from '@/store'
import { Provider } from 'react-redux'
import * as Automerge from '@automerge/automerge'
import { localStorage } from './utils/storage';


// let doc1 = Automerge.init<Doc>()

// type Card = {
//   title: string,
//   done: boolean
// }

// type Doc = {
//   cards: Card[]
// }

// const docId = 'chats'
// let channel = new BroadcastChannel(docId)

// function updateDoc(newDoc: Doc) {
//   console.log('updateDoc', newDoc)
//   let binary = Automerge.save(newDoc)
//   localStorage.setItem(docId, binary)
//   channel.postMessage(binary) // <-- this line is new
// }

// channel.onmessage = (ev) => {
//   let newDoc = Automerge.merge(doc1, Automerge.load(ev.data))
//   doc1 = newDoc

//   console.log('onmessage', newDoc, doc1)
// }

// updateDoc(Automerge.change(doc1, 'Add card', doc => {
//   doc.cards = []
//   doc.cards.push({ title: 'Rewrite everything in Clojure', done: false })
//   doc.cards.push({ title: 'Rewrite everything in Haskell', done: false })
// }))

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
