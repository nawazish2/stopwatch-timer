import { useState, useRef, useCallback, useEffect } from 'react'

function formatTime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n) => String(n).padStart(2, '0')
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`
  return `${pad(m)}:${pad(s)}`
}

export default function Timer() {
  const [inputHours, setInputHours] = useState('')
  const [inputMinutes, setInputMinutes] = useState('')
  const [inputSeconds, setInputSeconds] = useState('')

  const [remaining, setRemaining] = useState(0)
  const [initial, setInitial] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [pausedRemaining, setPausedRemaining] = useState(0)

  const intervalRef = useRef(null)
  const endTimeRef = useRef(0)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  const start = useCallback(() => {
    clearTimer()
    let totalSec
    if (pausedRemaining > 0) {
      totalSec = pausedRemaining
      setPausedRemaining(0)
    } else {
      const h = parseInt(inputHours) || 0
      const m = parseInt(inputMinutes) || 0
      const s = parseInt(inputSeconds) || 0
      totalSec = h * 3600 + m * 60 + s
      if (totalSec <= 0) return
      setInitial(totalSec)
    }

    setRemaining(totalSec)
    setDone(false)
    setRunning(true)
    endTimeRef.current = Date.now() + totalSec * 1000

    intervalRef.current = setInterval(() => {
      const left = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        clearTimer()
        setRunning(false)
        setDone(true)
      }
    }, 200)
  }, [inputHours, inputMinutes, inputSeconds, pausedRemaining, clearTimer])

  const pause = useCallback(() => {
    clearTimer()
    setRunning(false)
    setPausedRemaining(remaining)
  }, [clearTimer, remaining])

  const reset = useCallback(() => {
    clearTimer()
    setRunning(false)
    setRemaining(0)
    setInitial(0)
    setDone(false)
    setPausedRemaining(0)
    setInputHours('')
    setInputMinutes('')
    setInputSeconds('')
  }, [clearTimer])

  const progress = initial > 0 ? ((initial - remaining) / initial) * 100 : 0

  const hasSetTime = initial > 0 || pausedRemaining > 0

  return (
    <div className="timer">
      {!hasSetTime && !running ? (
        <div className="input-group">
          <h3>Set Timer</h3>
          <div className="time-inputs">
            <label>
              <input
                type="number"
                min="0"
                max="99"
                placeholder="0"
                value={inputHours}
                onChange={e => setInputHours(e.target.value)}
              />
              <span>Hours</span>
            </label>
            <label>
              <input
                type="number"
                min="0"
                max="59"
                placeholder="0"
                value={inputMinutes}
                onChange={e => setInputMinutes(e.target.value)}
              />
              <span>Minutes</span>
            </label>
            <label>
              <input
                type="number"
                min="0"
                max="59"
                placeholder="0"
                value={inputSeconds}
                onChange={e => setInputSeconds(e.target.value)}
              />
              <span>Seconds</span>
            </label>
          </div>
          <button className="btn btn-start" onClick={start}>Start Timer</button>
        </div>
      ) : (
        <>
          <div className={`display ${done ? 'display-done' : ''}`}>
            {formatTime(remaining)}
          </div>

          {initial > 0 && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}

          {done && <p className="done-msg">Time's up!</p>}

          <div className="controls">
            {running ? (
              <button className="btn btn-pause" onClick={pause}>Pause</button>
            ) : (
              <button className="btn btn-start" onClick={start}>
                {done ? 'Restart' : 'Resume'}
              </button>
            )}
            <button className="btn btn-reset" onClick={reset}>Reset</button>
          </div>
        </>
      )}
    </div>
  )
}
