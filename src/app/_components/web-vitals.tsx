'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    const metricsMap: Record<string, string> = {
      FID: '🖱️ First Input Delay (Atraso na Interação)',
      LCP: '📸 Largest Contentful Paint (Maior Elemento Carregado)',
      CLS: '🔄 Cumulative Layout Shift (Mudança de Layout)',
      TTFB: '⏳ Time to First Byte (Primeira Resposta do Servidor)',
      FCP: '🚀 First Contentful Paint (Primeiro Elemento Visível)',
    }

    const thresholds: Record<string, { good: number; medium: number }> = {
      FID: { good: 100, medium: 300 }, // Em ms (bom <100ms, médio <300ms, ruim >300ms)
      LCP: { good: 2500, medium: 4000 }, // Em ms (bom <2500ms, médio <4000ms, ruim >4000ms)
      CLS: { good: 0.1, medium: 0.25 }, // CLS não é ms, precisa de 3 casas decimais
      TTFB: { good: 800, medium: 1800 }, // Em ms (bom <800ms, médio <1800ms, ruim >1800ms)
      FCP: { good: 1800, medium: 3000 }, // Em ms (bom <1800ms, médio <3000ms, ruim >3000ms)
    }

    const metricName = metricsMap[metric.name] || metric.name
    const value =
      metric.name === 'CLS' ? metric.value.toFixed(3) : Math.round(metric.value)

    // Definir status com base nos thresholds
    let status = '🟢 Bom'
    let color = 'green'

    if (metric.value > thresholds[metric.name]?.medium) {
      status = '🔴 Ruim'
      color = 'red'
    } else if (metric.value > thresholds[metric.name]?.good) {
      status = '🟡 Médio'
      color = 'orange'
    }

    // console.log(
    //   `%c${metricName}: %c${value} ${metric.name === 'CLS' ? '' : 'ms'} %c(${status})`,
    //   'color: cyan; font-weight: bold',
    //   `color: ${color}; font-weight: bold`,
    //   'color: gray; font-style: italic',
    // )
  })

  return null
}
