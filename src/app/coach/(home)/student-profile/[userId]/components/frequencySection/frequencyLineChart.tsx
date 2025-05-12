import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface FrequencyLineChartProps {
  data: Record<string, { user: number; competitors: number }>
  selectedPeriod: string
}

export function FrequencyLineChart({
  data,
  selectedPeriod,
}: FrequencyLineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  function formatWeekLabel(dateString: string) {
    const week = dateString.slice(-2)
    return `Semana ${week}`
  }

  function filterDataByPeriod(
    data: Record<string, { user: number; competitors: number }>,
    period: string,
  ) {
    const numberOfWeeks =
      period === '30 dias' ? 4 : period === '60 dias' ? 8 : 12
    const lastWeeks = Object.keys(data).slice(-numberOfWeeks)

    const filteredData = lastWeeks.reduce(
      (acc, key) => {
        acc[key] = data[key]
        return acc
      },
      {} as Record<string, { user: number; competitors: number }>,
    )

    return filteredData
  }

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current)

      const filteredData = filterDataByPeriod(data, selectedPeriod)
      const weeks = Object.keys(filteredData).map((date) =>
        formatWeekLabel(date),
      )
      const userPerformance = Object.keys(filteredData).map(
        (key) => filteredData[key].user,
      )
      const competitorPerformance = Object.keys(filteredData).map(
        (key) => filteredData[key].competitors,
      )

      const option: echarts.EChartsOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>{a0}: {c0}h<br/>{a1}: {c1}h',
        },
        legend: {
          top: '0%',
          left: 'center',
          textStyle: {
            color: '#fff',
          },
        },
        xAxis: {
          type: 'category',
          data: weeks,
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
          axisLabel: {
            formatter: (value: number) => `${value / 1000}h`,
          },
        },
        series: [
          {
            name: 'Aluno',
            type: 'line',
            data: userPerformance,
            itemStyle: {
              color: '#F9D14B',
            },
            lineStyle: {
              width: 5,
            },
            symbolSize: 12,
          },
          {
            name: 'Concorrentes',
            type: 'line',
            data: competitorPerformance,
            itemStyle: {
              color: '#5C79E3',
            },
            lineStyle: {
              width: 5,
            },
            symbolSize: 12,
          },
        ],
      }

      chartInstance.setOption(option)

      function handleResize() {
        chartInstance.resize()
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        chartInstance.dispose()
      }
    }
  }, [data, selectedPeriod])

  return <div ref={chartRef} className="w-full h-[400px]" />
}
