'use client'
import React, { useState } from 'react'

interface AnalogClockProps {
  initialHours: number
  initialMinutes: number
  onTimeSelect: (hours: number, minutes: number) => void
  setIsOpen: (isOpen: boolean) => void
  setOpenClockPicker: (isOpen: boolean) => void
}

export default function AnalogClock({
  initialHours,
  initialMinutes,
  onTimeSelect,
  setIsOpen,
  setOpenClockPicker,
}: AnalogClockProps) {
  const [hours, setHours] = useState<number | null>(initialHours)
  const [minutes, setMinutes] = useState<number | null>(initialMinutes)
  const [tempMinutes, setTempMinutes] = useState<number | null>(null) // Minutos temporários
  const [showMinutes, setShowMinutes] = useState(false)

  function handleHourClick(number: number) {
    setHours(number)

    setTimeout(() => {
      setShowMinutes(true)
    }, 800)
  }

  function handleMinuteClick(number: number) {
    setTempMinutes(number)

    setTimeout(() => {
      setMinutes(number)
    }, 800)
  }

  function handleSaveTimer() {
    onTimeSelect(hours ?? 0, minutes ?? 0)
    setOpenClockPicker(false)
  }

  return (
    <div className="flex flex-col items-center text-left space-y-8">
      <div className="w-full text-left">
        <h1 className="text-white">Tempo Gasto na Atividade</h1>
      </div>
      <div className="text-2xl w-full text-white flex justify-center items-center gap-2">
        <input
          onFocus={() => setShowMinutes(false)}
          onChange={(event) => {
            let hourInNumber = Number(event.target.value)

            if (hourInNumber > 24) {
              hourInNumber = 24
            }

            setHours(hourInNumber)
          }}
          value={hours !== null ? hours : ''}
          type="number"
          max={24}
          maxLength={2}
          data-active={!showMinutes}
          className="bg-blue-500/10 w-32 h-20 flex items-center justify-center rounded-2xl p-4 data-[active=true]:bg-blue-500/50"
          placeholder={String(hours || 0).padStart(2, '0')}
        />

        <span className="text-6xl font-light">:</span>
        <input
          type="number"
          onFocus={() => setShowMinutes(true)}
          onChange={(event) => {
            const value = event.target.value

            if (value === '') {
              setTempMinutes(null)
              setMinutes(null)
              return
            }

            let minuteInNumber = Number(value)

            if (minuteInNumber > 60) {
              minuteInNumber = 60
            }

            setTempMinutes(minuteInNumber)
            setMinutes(minuteInNumber)
          }}
          data-active={showMinutes}
          max={60}
          value={minutes !== null ? minutes : ''}
          placeholder={String(tempMinutes !== null ? tempMinutes : 0).padStart(
            2,
            '0',
          )}
          className="bg-blue-500/10 w-32 h-20 flex items-center justify-center rounded-2xl p-4 data-[active=true]:bg-blue-500/50"
        />
      </div>
      {!showMinutes ? (
        <HourClock hours={hours} onClick={handleHourClick} />
      ) : (
        <MinuteClock minutes={tempMinutes} onClick={handleMinuteClick} />
      )}

      <div className="w-full flex items-center gap-10 justify-between">
        <button
          onClick={() => {
            setIsOpen(false)
          }}
          className="border px-4 rounded-2xl border-transparent text-yellow-600 hover:border-yellow-600 hover:bg-yellow-600/10 "
        >
          Cancelar
        </button>
        <button
          onClick={handleSaveTimer}
          className="border px-4 rounded-2xl border-transparent text-yellow-600 hover:border-yellow-600 hover:bg-yellow-600/10 "
        >
          Salvar
        </button>
      </div>
    </div>
  )
}

interface HourClockProps {
  hours: number | null
  onClick: (number: number) => void
}

function HourClock({ hours, onClick }: HourClockProps) {
  const pointerRotation = hours !== null ? (hours % 12) * 30 : 0

  return (
    <div className="relative w-64 h-64 bg-gray-800 rounded-full border-4 border-gray-600">
      {Array.from({ length: 12 }).map((_, index) => {
        const number = index === 0 ? 12 : index
        const angle = (index * 360) / 12 - 90
        const x = Math.cos((angle * Math.PI) / 180) * 90
        const y = Math.sin((angle * Math.PI) / 180) * 90

        return (
          <button
            key={number}
            className={`absolute text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center ${
              hours === number ? 'bg-gray-700' : 'hover:bg-gray-700'
            } focus:outline-none`}
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => onClick(number)}
          >
            {number}
          </button>
        )
      })}

      <div
        className="absolute w-2 h-16 bg-yellow-500 origin-bottom rounded"
        style={{
          transform: `translate(-50%, -100%) rotate(${pointerRotation}deg)`,
          top: '50%',
          left: '50%',
        }}
      />

      <div className="absolute w-4 h-4 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  )
}

interface MinuteClockProps {
  minutes: number | null
  onClick: (number: number) => void
}

function MinuteClock({ minutes, onClick }: MinuteClockProps) {
  const pointerRotation = minutes !== null ? minutes * 6 : 0

  return (
    <div className="relative w-64 h-64 bg-gray-800 rounded-full border-4 border-gray-600">
      {Array.from({ length: 12 }).map((_, index) => {
        const number = index * 5
        const angle = (index * 360) / 12 - 90
        const x = Math.cos((angle * Math.PI) / 180) * 90
        const y = Math.sin((angle * Math.PI) / 180) * 90

        return (
          <button
            key={number}
            className={`absolute text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center ${
              minutes === number ? 'bg-gray-700' : 'hover:bg-gray-700'
            } focus:outline-none`}
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => onClick(number)}
          >
            {number}
          </button>
        )
      })}

      <div
        className="absolute w-2 h-16 bg-yellow-500 origin-bottom rounded"
        style={{
          transform: `translate(-50%, -100%) rotate(${pointerRotation}deg)`,
          top: '50%',
          left: '50%',
        }}
      />

      <div className="absolute w-4 h-4 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  )
}
