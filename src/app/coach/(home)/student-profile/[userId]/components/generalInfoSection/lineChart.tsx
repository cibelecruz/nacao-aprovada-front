import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface LineChartProps {
  data: Record<string, { user: number; competitors: number }>
}

export function LineChart({ data }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  function formatDate(dateString: string): string {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const formattedMonth = month.startsWith('-') ? month.substring(1) : month

    return `${formattedMonth}/${year}`
  }

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current)

      const months = Object.keys(data).map((date) => formatDate(date))
      const userPerformance = months.map(
        (_, index) => data[Object.keys(data)[index]].user * 100,
      )
      const competitorPerformance = months.map(
        (_, index) => data[Object.keys(data)[index]].competitors * 100,
      )

      const option: echarts.EChartsOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>{a0}: {c0}%<br/>{a1}: {c1}%',
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
          data: months,
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
            formatter: '{value} %',
          },
        },
        series: [
          {
            name: 'Usuário',
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
  }, [data])

  return <div ref={chartRef} className="w-full h-[400px]" />
}
