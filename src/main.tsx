import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { store } from '@/store'
import { Provider } from 'react-redux'
import { ChatsDoc, setChats } from './store/slices/chats'
import { UsersDoc, setSharedUsers } from './store/slices/users'
import { loadDoc } from './utils/automerge'
import { localStorageJSON } from './utils/storage'

loadDoc<ChatsDoc>(localStorageJSON, __CHATS_LS__, (doc) =>
  store.dispatch(setChats(doc))
)

loadDoc<UsersDoc>(localStorageJSON, __USERS_LS__, (doc) =>
  store.dispatch(setSharedUsers(doc))
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
