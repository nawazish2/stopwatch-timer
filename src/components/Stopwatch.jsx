import { useState, useRef, useCallback } from 'react'

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const centiseconds = Math.floor((ms % 1000) / 10)

  const pad = (n) => String(n).padStart(2, '0')
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`
}

export default function Stopwatch() {
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const intervalRef = useRef(null)
  const startTimeRef = useRef(0)

  const start = useCallback(() => {
    if (running) return
    startTimeRef.current = Date.now() - time
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTimeRef.current)
    }, 10)
    setRunning(true)
  }, [running, time])

  const pause = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setTime(0)
    setRunning(false)
    setLaps([])
  }, [])

  const recordLap = useCallback(() => {
    if (!running) return
    const prevLap = laps.length > 0 ? laps[0].total : 0
    setLaps([{ total: time, lap: time - prevLap }, ...laps])
  }, [running, time, laps])

  return (
    <div className="stopwatch">
      <div className="display">{formatTime(time)}</div>

      <div className="controls">
        {!running ? (
          <button className="btn btn-start" onClick={start}>Start</button>
        ) : (
          <button className="btn btn-pause" onClick={pause}>Pause</button>
        )}
        <button className="btn btn-reset" onClick={reset}>Reset</button>
        <button className="btn btn-lap" onClick={recordLap} disabled={!running}>
          Lap
        </button>
      </div>

      {laps.length > 0 && (
        <div className="laps">
          <div className="laps-header">
            <span>Lap</span>
            <span>Lap Time</span>
            <span>Total Time</span>
          </div>
          {laps.map((l, i) => (
            <div className="lap-row" key={i}>
              <span>#{laps.length - i}</span>
              <span>{formatTime(l.lap)}</span>
              <span>{formatTime(l.total)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
