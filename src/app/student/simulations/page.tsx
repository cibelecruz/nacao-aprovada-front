'use client'

import { TitlePage } from '@/app/_components/titlePage'
import { CardMobile } from './components/cardMobile'
import { TableSimulation } from './components/tableSimulation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/axios'
import ConfirmButton from '@/app/_components/confirmButton'

interface SubjectsInSimulationProps {
  id: string
  name: string
  totalQuestions: number
  correctQuestions: number
}

interface SimulationProps {
  id: string
  userId: string
  name: string
  date: string
  subjects: SubjectsInSimulationProps[]
}

export default function SimulationsPage() {
  const [data, setData] = useState<SimulationProps[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    api.get('/simulations').then((response) => {
      setData(response.data.simulations)
    })
  }, [])

  const filteredData = useMemo(() => {
    return Array.isArray(data)
      ? data.filter((item) => {
          const matchesName = item.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
          const matchesDate =
            (!startDate || new Date(item.date) >= new Date(startDate)) &&
            (!endDate || new Date(item.date) <= new Date(endDate))
          return matchesName && matchesDate
        })
      : []
  }, [data, searchTerm, startDate, endDate])

  const router = useRouter()

  async function handleDeleteSimulation(id: string) {
    const response = await api.delete(`/simulations/${id}`)

    if (response.status !== 200) {
      toast.error('Erro ao deletar simulado')
    }

    window.location.reload()
  }

  return (
    <div className="md:flex md:justify-center sm:p-auto min-h-max p-4 pb-36 overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent active:scrollbar-thumb-yellow-600 z-10">
      <div className="max-sm:w-full md:w-1/2 lg:pl-10 lg:w-3/5 mt-7 lg:mt-0 space-y-10">
        <div className="flex justify-between items-center">
          <TitlePage title="Simulados" className="text-yellow-600 text-3xl" />
          <ConfirmButton
            onClick={() => router.push('/student/simulations/add')}
            className="text-black flex items-center gap-2"
          >
            <Plus className="size-5" />
            <span className="max-md:hidden">Adicionar simulado</span>
          </ConfirmButton>
        </div>

        <div className="bg-[#070E17] p-5 rounded-lg">
          <div className="grid md:grid-cols-[1fr,auto,auto] gap-4 mb-8 py-4 max-md:space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
              <input
                type="text"
                placeholder="Buscar simulado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-800 border border-blue-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute -top-5 left-0 text-sm text-gray-400">
                  De:
                </div>
                <input
                  type="date"
                  placeholder="Data inicial"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-5 left-0 text-sm text-gray-400">
                Até:
              </div>
              <input
                type="date"
                placeholder="Data final"
                value={endDate}
                onChange={(e) => {
                  const value = e.target.value

                  if (startDate && new Date(value) < new Date(startDate)) {
                    toast.error('Data final não pode ser antes da data inicial')
                  } else {
                    setEndDate(value)
                  }
                }}
                className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-blue-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="lg:bg-blue-800 lg:p-4 lg:rounded-xl">
            {filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <p className="text-gray-400 text-lg">
                  Nenhum simulado encontrado para os filtros aplicados.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden md:block">
                  <TableSimulation
                    handleDeleteSimulation={handleDeleteSimulation}
                    data={filteredData}
                  />
                </div>
                <div className="md:hidden space-y-4 p-4">
                  {filteredData.map((item) => (
                    <CardMobile
                      key={item.id}
                      item={item}
                      handleDeleteSimulation={handleDeleteSimulation}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
