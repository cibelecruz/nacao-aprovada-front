import {
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { NavigationButton } from '../coach/(home)/components/navigationButton'
import { useRouter } from 'next/navigation'
import { Checkbox } from './ui/checkbox'

interface NavigationTableProps {
  header: Array<React.ReactNode>
  items: {
    key: string
    check?: boolean
    [key: string]: React.ReactNode
  }[]
  actions?: Array<React.ReactNode>
  link?: string
  label?: string
  setCheckedItem?: (id: string, checked: boolean) => void
}

export function NavigationTable({
  items,
  actions,
  header,
  link,
  label,
  setCheckedItem,
}: NavigationTableProps) {
  const router = useRouter()

  const [counter, setCounter] = useState(10)
  const [viewpage, setViewPage] = useState(0)

  const page = Math.ceil(items.length / counter)
  const indexInit = counter * viewpage
  const indexLast = Math.min(indexInit + counter, items.length)
  const itemsPage = items.slice(indexInit, indexLast)

  useEffect(() => {
    setViewPage(0)
  }, [items, actions, header, link])

  if (items.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-gray-300">Nenhum item encotrado</p>
      </div>
    )
  }
  return (
    <>
      <div className="w-full mt-5 rounded-lg border border-black dark:border-blue-400/60 overflow-hidden">
        <table className="w-full text-left">
          <thead className="text-gray-600 dark:text-zinc-400">
            <tr>
              {header.map((item, index) => {
                return (
                  <th
                    className={`py-3 px-3 ${item === 'actions' ? 'text-right' : 'text-left'}`}
                    key={index}
                  >
                    {item === 'actions'
                      ? 'Ações'
                      : item === 'check'  
                        ? 'Ativo'
                        : item}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {itemsPage.map((item) => {
              const itemsObjectKeys = Object.keys(item).filter(
                (key) => key !== 'key' && key !== 'check',
              )
              const widthPerItem = (1 / itemsObjectKeys.length) * 100
              const width = `w-[${header[0] === 'check' ? widthPerItem - 1 / 12 : widthPerItem}%]`

              return (
                <tr
                  className="hover:bg-zinc-300 hover:dark:bg-slate-700 text-black dark:text-white text-base border-y border-y-blue-400/60 cursor-pointer w-full px-2"
                  key={item.key}
                  onClick={() => link && router.push(link?.concat(item.key))}
                >
                  {header[0] === 'check' && setCheckedItem ? (
                    <td className="w-1/12 px-3">
                      <Checkbox
                        checked={item.check}
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={() =>
                          setCheckedItem(item.key, !item.check)
                        }
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-transparent border-yellow-500"
                      />
                    </td>
                  ) : (
                    ''
                  )}
                  {itemsObjectKeys.map((key) => (
                    <td
                      className={`p-1 px-3 ${width} ${key === 'actions' && 'text-right'}`}
                      key={key}
                    >
                      {typeof item[key] === 'string'
                        ? item[key].slice(0, 25) +
                          (item[key].length > 25 ? '...' : '')
                        : item[key]}
                    </td>
                  ))}
                  {actions && <td>{actions}</td>}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex mt-7 w-full justify-between items-end">
        <p className="text-sm text-gray-500 pb-3">
          {label && `${items.length} ${label}`}
        </p>

        <div className="flex items-center text-gray-300 gap-2">
          <p>Linhas por página {counter}</p>
          <div className="flex flex-col items-center">
            <button
              className="flex items-center justify-center hover:text-yellow-700"
              onClick={() => setCounter(counter > 5 ? counter - 5 : 1)}
            >
              <ChevronUp size={15} />
            </button>
            <button
              className="flex items-center justify-center hover:text-yellow-700"
              onClick={() => setCounter(counter === 1 ? 5 : counter + 5)}
            >
              <ChevronDown size={15} />
            </button>
          </div>

          <p className="px-5">
            Página {viewpage + 1} de {page}
          </p>

          <div className="flex items-center gap-2">
            <NavigationButton
              disabled={viewpage === 0}
              onClick={() => setViewPage(0)}
              icon={<ChevronsLeft />}
            />

            <NavigationButton
              disabled={viewpage === 0}
              onClick={() => setViewPage(viewpage - 1)}
              icon={<ChevronLeft />}
            />

            <NavigationButton
              disabled={viewpage + 1 === page}
              onClick={() => setViewPage(viewpage + 1)}
              icon={<ChevronRight />}
            />

            <NavigationButton
              disabled={viewpage + 1 === page}
              onClick={() => setViewPage(page - 1)}
              icon={<ChevronsRight />}
            />
          </div>
        </div>
      </div>
    </>
  )
}
