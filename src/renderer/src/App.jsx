import electron from '@/assets/electron.png'
import react from '@/assets/react.svg'
import vite from '@/assets/vite.svg'
import { Button } from 'antd'
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <div className="logos">
          <div className="img-box">
            <img src={electron} style={{ height: '24vw' }} className="App-logo" alt="electron" />
          </div>
          <div className="img-box">
            <img src={vite} style={{ height: '19vw' }} alt="vite" />
          </div>
          <div className="img-box">
            <img src={react} style={{ maxWidth: '100%' }} className="App-logo" alt="logo" />
          </div>
        </div>
        <p>Hello Electron + Vite + React!</p>
        <p>
          <Button type="primary" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </Button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <div>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
          <div className="static-public">
            Place static files into the <code>src/renderer/public</code> folder
            <img style={{ width: 90 }} src="./images/node.png" />
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
