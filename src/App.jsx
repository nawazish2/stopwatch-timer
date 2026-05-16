import { useState } from 'react'
import Stopwatch from './components/Stopwatch'
import Timer from './components/Timer'
import './App.css'

function App() {
  const [tab, setTab] = useState('stopwatch')

  return (
    <div className="app">
      <header>
        <h1>Stopwatch & Timer</h1>
        <p className="subtitle">Web Dev Cohort 2026</p>
      </header>

      <div className="tabs">
        <button
          className={`tab ${tab === 'stopwatch' ? 'active' : ''}`}
          onClick={() => setTab('stopwatch')}
        >
          Stopwatch
        </button>
        <button
          className={`tab ${tab === 'timer' ? 'active' : ''}`}
          onClick={() => setTab('timer')}
        >
          Timer
        </button>
      </div>

      <div className="tab-content">
        {tab === 'stopwatch' ? <Stopwatch /> : <Timer />}
      </div>
    </div>
  )
}

export default App
