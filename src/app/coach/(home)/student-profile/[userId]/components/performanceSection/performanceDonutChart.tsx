import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface PerformanceDonutChartProps {
  correct: number
  incorrect: number
  totalQuestions: number
  progress: number
  isStudentProfile?: boolean
}

export function PerformanceDonutChart({
  correct,
  incorrect,
  totalQuestions,
  progress,
  isStudentProfile,
}: PerformanceDonutChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function initializeChart() {
      if (chartRef.current) {
        const chartInstance = echarts.init(chartRef.current)
        const accuracyPercentage =
          ((correct / (correct + incorrect)) * 100).toFixed(1) || '0'

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
              name: 'Desempenho',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: true,
              itemStyle: {
                borderRadius: 0,
                borderColor: '#fff',
                borderWidth: 0,
              },
              label: {
                show: true,
                position: 'center',
                formatter: `${isNaN(Number(accuracyPercentage)) ? 0 : accuracyPercentage}%\nAcertos`,
                fontSize: 20,
                fontWeight: 'bold',
                color: '#fff',
              },
              emphasis: {
                label: {
                  show: false,
                },
              },
              labelLine: {
                show: false,
              },
              data: [
                {
                  value: correct,
                  name: isStudentProfile ? 'Aluno' : 'Concorrência',
                  itemStyle: {
                    color: isStudentProfile ? '#DE9C29' : '#5C79E3',
                  },
                },
                {
                  value: incorrect,
                  name: 'Erros',
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
    }

    return initializeChart()
  }, [correct, incorrect, totalQuestions, progress, isStudentProfile])

  return <div ref={chartRef} className="w-full h-[300px] mx-auto" />
}
