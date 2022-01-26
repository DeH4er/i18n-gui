import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import './samples/electron-store'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
  window.removeLoading,
)

// Use ipcRenderer.on
window.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})
