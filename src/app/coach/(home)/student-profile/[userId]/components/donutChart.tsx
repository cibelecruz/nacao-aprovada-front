import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface DonutChartProps {
  value: number
}

export function DonutChart({ value }: DonutChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = echarts.init(chartRef.current)

      const option: echarts.EChartsOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {d}%',
        },
        legend: {
          top: '0%',
          left: 'center',
          textStyle: {
            color: '#fff',
          },
        },
        series: [
          {
            name: 'Progresso',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 0,
              borderColor: '#fff',
              borderWidth: 0,
            },
            label: {
              show: false,
              position: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              color: '#fff',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold',
                formatter: '{d}%',
              },
            },
            labelLine: {
              show: true,
            },
            data: [
              {
                value,
                name: 'Concluído',
                itemStyle: { color: '#DE9C29' },
              },
              {
                value: 100 - value,
                name: 'Restante',
                itemStyle: { color: '#E0E7FF1A' },
              },
            ],
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
  }, [value])

  return <div ref={chartRef} className="w-full h-[400px]" />
}
