'use client'

import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

import dayjs from '@/lib/dayjs'
import { toast } from 'sonner'

interface ChartData {
  id: string
  totalCorrectAmount: number
  totalIncorrectAmount: number
  date: string
}

interface LineChartProps {
  data: ChartData[]
  className?: string
  chartId: string
}

function formatChartData(data: ChartData[]) {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  return {
    dates: sortedData.map((item) => dayjs(item.date).format('DD/MM')),
    correctAnswers: sortedData.map((item) => item.totalCorrectAmount),
    incorrectAnswers: sortedData.map((item) => item.totalIncorrectAmount),
  }
}

function filterDataByPeriod(
  data: ChartData[],
  startDate: string,
  endDate: string,
): ChartData[] {
  const initDate = new Date(startDate)
  const lastDate = new Date(endDate)

  return data.filter((item) => {
    const itemDate = new Date(item.date)
    return itemDate >= initDate && itemDate <= lastDate
  })
}

export default function LineChart({ data, className }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [startDate, setStartDate] = useState(data[0].date)
  const [endDate, setEndDate] = useState(data[data.length - 1].date)

  const [inputStartDate, setInputStartDate] = useState(data[0].date)
  const [inputEndDate, setInputEndDate] = useState(data[data.length - 1].date)

  function setNewEndDate(value: string) {
    const newDate = new Date(value)
    const date = new Date(data[data.length - 1].date)
    const inintDate = new Date(startDate)

    if (newDate.getTime() <= inintDate.getTime()) {
      inintDate.setDate(inintDate.getDate() + 1)
      setEndDate(inintDate.toISOString().split('T')[0])
      setInputEndDate(inintDate.toISOString().split('T')[0])
      toast.error('A data final não pode ser anterior ou igual à data inicial.')
    } else if (newDate.getTime() > date.getTime()) {
      setEndDate(data[data.length - 1].date)
      setInputEndDate(data[data.length - 1].date)
      toast.error('Data maior do que o último registro salvo')
    } else {
      setEndDate(value)
    }
  }

  function setNewStartDate(value: string) {
    const newDate = new Date(value)
    const date = new Date(data[0].date)
    const lastdate = new Date(endDate)

    if (newDate.getTime() >= lastdate.getTime()) {
      lastdate.setDate(lastdate.getDate() - 1)
      setStartDate(lastdate.toISOString().split('T')[0])
      setInputStartDate(lastdate.toISOString().split('T')[0])
      toast.error('A data inicial não pode ser supeior ou igual à data final.')
    } else if (newDate.getTime() < date.getTime()) {
      setStartDate(data[0].date)
      setInputStartDate(data[0].date)
      toast.error('Data menor do que o último registro salvo')
    } else {
      setStartDate(value)
    }
  }

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return

    const filterData = filterDataByPeriod(data, startDate, endDate)
    const { dates, correctAnswers, incorrectAnswers } =
      formatChartData(filterData)
    const chart = echarts.init(chartRef.current)

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        data: ['Respostas Corretas', 'Respostas Incorretas'],
        textStyle: {
          color: '#fff',
        },
        top: 20,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLine: {
          lineStyle: {
            color: '#ffffff30',
          },
        },
        axisLabel: {
          color: '#fff',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#ffffff30',
          },
        },
        splitLine: {
          lineStyle: {
            color: '#ffffff10',
          },
        },
        axisLabel: {
          color: '#fff',
        },
      },
      series: [
        {
          name: 'Respostas Incorretas',
          type: 'line',
          data: incorrectAnswers,
          smooth: true,
          symbolSize: 5,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: '#ef4444',
          },
        },
        {
          name: 'Respostas Corretas',
          type: 'line',
          data: correctAnswers,
          smooth: true,
          symbolSize: 5,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: '#22c55e',
          },
        },
      ],
    }

    chart.setOption(option)

    const handleResize = () => {
      chart.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      chart.dispose()
      window.removeEventListener('resize', handleResize)
    }
  }, [data, startDate, endDate])

  return (
    <div className={className}>
      <div className="flex justify-between w-full">
        <div className="space-x-3">
          <label htmlFor="startDate">Data Inícial:</label>
          <input
            id="startDate"
            type="date"
            value={inputStartDate}
            onChange={(e) => {
              const value = e.target.value
              setInputStartDate(value)
              value[0] !== '0' && setNewStartDate(e.target.value)
            }}
            className="bg-transparent text-gray-200 w-32"
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          />
        </div>
        <div className="space-x-3">
          <label htmlFor="endDate">Data Final:</label>
          <input
            id="endDate"
            type="date"
            value={inputEndDate}
            onChange={(e) => {
              const value = e.target.value
              setInputEndDate(value)
              value[0] !== '0' && setNewEndDate(e.target.value)
            }}
            className="bg-transparent text-gray-200 w-32"
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          />
        </div>
      </div>

      <div ref={chartRef} className={`w-full min-h-[400px]`} />
    </div>
  )
}
