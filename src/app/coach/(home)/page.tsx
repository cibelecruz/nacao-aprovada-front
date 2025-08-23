'use client'

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  FolderInput,
  UserPlus,
} from 'lucide-react'

import { useEffect, useMemo, useRef, useState } from 'react'

import { TitlePage } from '@/app/_components/titlePage'
import { api } from '@/lib/axios'

import { Button } from '../../_components/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../_components/ui/dropdown-menu'

import { NavigationButton } from './components/navigationButton'
import { UserTBodyList } from './components/userTBodylist'
import { Loader } from '@/app/_components/loader'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/_components/ui/tooltip'
import { toast } from 'sonner'
import Papa from 'papaparse'
import { PageContainer } from '@/app/_components/pageContainer'
import { ContentContainer } from '@/app/_components/contentContainer'
import { Checkbox } from '@/app/_components/ui/checkbox'
import { DialogEmail } from './components/dialogEmail'

export interface UserProps {
  id: string
  name: string
  email: string
  cpf?: string
  phone?: string
  courses: {
    [courseName: string]: {
      expirationDate: string
    }
  }
  lastAccess: string
  expectedWorkload: {
    [key: string]: number
  }
  completedWorkload: {
    [key: string]: number
  }
}

export default function UserList() {
  const [users, setUsers] = useState<UserProps[]>([])
  const [counter, setCounter] = useState(10)
  const [viewpage, setViewPage] = useState(0)
  const [expected, setExpected] = useState('30 dias')
  const [realized, setRealized] = useState('allProgress')
  const [source, setSource] = useState('')
  const [loader, setLoader] = useState(true)

  const [usersCheck, setUsersCheck] = useState<string[]>([])
  const [checkAll, setCheckAll] = useState<boolean>(false)
  const [filterUSersChecked, setFilterUserChecked] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const usersFilter = useMemo(() => {
    return users
      .filter((user) => {
        const sourceLower = source.toLowerCase()

        const courseMatch = Object.keys(user.courses || {}).some((course) =>
          course.toLowerCase().includes(sourceLower),
        )
        return (
          user.name.toLowerCase().includes(sourceLower) ||
          user.email.toLowerCase().includes(sourceLower) ||
          (user.cpf && user.cpf.includes(sourceLower)) ||
          (user.phone && user.phone.includes(sourceLower)) ||
          user.lastAccess.toLowerCase().includes(sourceLower) ||
          courseMatch
        )
      })
      .filter((user) => {
        if (realized === 'allProgress') return true

        const expectedHours = user.expectedWorkload[expected]
        const completedHours = user.completedWorkload[expected]

        const progress =
          expectedHours > completedHours
            ? Math.round((1 - completedHours / expectedHours) * 100)
            : 0

        if (realized === 'highProgress') {
          return progress <= 40
        }
        if (realized === 'midProgress') {
          return progress > 40 && progress <= 60
        }
        if (realized === 'lowProgress') {
          return progress > 60
        }

        return true
      })
      .filter((user) =>
        filterUSersChecked ? usersCheck.includes(user.id) : user,
      )
  }, [users, source, realized, expected, filterUSersChecked, usersCheck])

  useEffect(() => {
    const isCheckedAll = usersFilter.every((user) =>
      usersCheck.includes(user.id),
    )
    if (isCheckedAll && usersFilter.length > 0) {
      setCheckAll(true)
    } else {
      setCheckAll(false)
      setFilterUserChecked(false)
    }
  }, [usersCheck, usersFilter])

  function checkUserConf(id: string, checked: boolean) {
    if (checked) {
      setUsersCheck([...usersCheck, id])
    } else {
      setUsersCheck(usersCheck.filter((user) => user !== id))
    }
  }

  function checkedAllConf() {
    setCheckAll(!checkAll)
    if (!checkAll) {
      setUsersCheck((prev) => {
        const newIds = usersFilter.map((user) => user.id)
        const updatedSet = new Set([...prev, ...newIds])
        return Array.from(updatedSet)
      })
    } else {
      setUsersCheck([])
    }
  }

  const counterConf = (value: number) => {
    setCounter(value)
    setViewPage(0)
  }

  const sourceConf = (value: string) => {
    setSource(value)
    setViewPage(0)
  }

  const realizedConf = (value: string) => {
    setRealized(value)
    setViewPage(0)
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const requiredColumns = [
            'name',
            'email',
            'courses.id',
            'courses.registrationDate',
            'courses.expirationDate',
          ]

          const csvColumns = results.meta.fields || []
          const missingColumns = requiredColumns.filter(
            (col) => !csvColumns.includes(col),
          )

          if (missingColumns.length > 0) {
            toast.error(
              `O arquivo CSV está faltando as seguintes colunas: ${missingColumns.join(', ')}.`,
              {
                duration: 5000,
              },
            )
            return
          }

          const formData = new FormData()
          formData.append('file', file)

          api
            .post('/register-bulk-users', formData)
            .then(({ status, data }) => {
              if (status === 200) {
                if (data.userWithErrors.length > 0) {
                  console.log('Erros de cadastro:', data.userWithErrors)
                  toast.success('Alguns alunos não foram cadastrados.', {
                    description: data.userWithErrors
                      .map(
                        (user: { email: string; error: string }) => user.email,
                      )
                      .join(', '),
                  })
                } else {
                  toast.success('Alunos cadastrados com sucesso.')
                }
              } else {
                toast.error('Erro ao cadastrar alunos.')
              }
            })
        },
        header: true,
        skipEmptyLines: true,
      })
    }
  }

  function handleAddUsersFile() {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const page = Math.ceil(usersFilter.length / counter)
  const indexInit = counter * viewpage
  const indexLast = Math.min(indexInit + counter, usersFilter.length)
  const userPage = usersFilter.slice(indexInit, indexLast)

  useEffect(() => {
    setLoader(true)
    api.get('/users').then((response) => {
      setLoader(false)
      setUsers(response.data)
    })
  }, [])

  return (
    <PageContainer>
      <ContentContainer>
        <TitlePage className="text-yellow-600" title="Painel dos alunos" />
        <p className="text-gray-500 dark:text-gray-300">
          Visualize o panorama geral de todos os alunos matriculados
        </p>
        {loader ? (
          <Loader />
        ) : (
          <>
            <div className="flex items-end w-full justify-between">
              <div className="w-4/5 mt-8 space-x-3 flex items-center">
                <input
                  className="bg-transparent border border-yellow-500 rounded-2xl text-gray-300 h-9 w-4/12 pl-4  hover:border-yellow-400 hover:shadow hover:shadow-yellow-600 transition-all"
                  placeholder="Faça sua pesquisa..."
                  type="text"
                  value={source}
                  onChange={(e) => sourceConf(e.target.value)}
                />
                <Button label="Limpar busca" onClick={() => setSource('')} />
                {usersCheck.length > 0 && (
                  <>
                    <Checkbox
                      checked={filterUSersChecked}
                      onCheckedChange={() => {
                        setFilterUserChecked(!filterUSersChecked)
                        setSource('')
                      }}
                      className="data-[state=checked]:bg-green-500 data-[state=checked]:border-transparent border-yellow-500"
                    />
                    <p>Ver somente alunos marcados</p>
                  </>
                )}
              </div>
              <div className="flex gap-4 items-center justify-end w-1/5">
                {usersCheck.length > 0 && (
                  <DialogEmail
                    emails={users
                      .filter((user) => usersCheck.includes(user.id))
                      .map((user) => user.email)}
                  />
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleAddUsersFile}
                        className="bg-yellow-400 dark:bg-yellow-600 mb-1 hover:bg-yellow-300 hover:dark:bg-yellow-500 p-2 h-max rounded-lg"
                      >
                        <UserPlus className="size-5 text-black" />
                        <input
                          hidden
                          ref={fileInputRef}
                          name="inputFile"
                          type="file"
                          accept=".csv"
                          onChange={handleFileChange}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm font-semibold mb-2">
                        Estrutura do arquivo CSV:
                      </p>
                      <pre className="text-xs text-black bg-gray-100 p-2 rounded-md">
                        name,email,role,courses.id,courses.registrationDate,courses.expirationDate
                      </pre>
                      <div className="text-xs mt-2">
                        <strong>Observações:</strong>
                        <ul className="list-disc list-inside">
                          <li>
                            <strong>name</strong>: Nome do usuário
                            (obrigatório).
                          </li>
                          <li>
                            <strong>email</strong>: E-mail do usuário
                            (obrigatório).
                          </li>
                          <li>
                            <strong>courses.id</strong>: ID do curso
                            (obrigatório).
                          </li>
                          <li>
                            <strong>courses.registrationDate</strong>: Data de
                            matrícula no curso (opcional).
                          </li>
                          <li>
                            <strong>courses.expirationDate</strong>: Data de
                            expiração do curso (opcional).
                          </li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <button
                  title="Exportar os dados dos alunos"
                  onClick={async () => {
                    try {
                      const response = await api.get(
                        '/users/export-onboarding',
                        {
                          responseType: 'blob',
                        },
                      )

                      const url = window.URL.createObjectURL(
                        new Blob([response.data]),
                      )
                      const link = document.createElement('a')
                      link.href = url
                      link.setAttribute('download', 'onboarding.xlsx')
                      document.body.appendChild(link)
                      link.click() // Aciona o download
                      link.remove() // Remove o link do DOM
                    } catch (error) {
                      toast.error('Erro ao exportar dados:')
                    }
                  }}
                  className="dark:bg-yellow-600 bg-yellow-500 mb-1 hover:bg-yellow-400 hover:dark:bg-yellow-500 p-2 h-max rounded-lg text-black"
                >
                  <FolderInput className="size-5" />
                </button>
              </div>
            </div>

            <div className="w-full mt-5 rounded-lg border border-black dark:border-blue-400/60 overflow-hidden">
              <table className="w-full text-left">
                <thead className="text-gray-500">
                  <tr>
                    <th className="w-[2%] p-1">
                      <Checkbox
                        checked={checkAll}
                        onCheckedChange={checkedAllConf}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-transparent border-yellow-500"
                      />
                    </th>
                    <th className="p-2 py-3 w-1/5">Alunos</th>
                    <th className="w-1/5 px-1">Concurso</th>
                    <th className="w-1/5 px-1">CPF</th>
                    <th className="w-1/5 px-1">Vencimento</th>
                    <th className="w-1/5 px-1">Último acesso</th>

                    <th className="w-[8%] px-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center justify-center gap-2 border border-gray-400 rounded-md py-1 px-2 hover:text-yellow-700">
                            Previsto <ChevronsUpDown size={17} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-slate-800 text-black dark:text-gray-300">
                          <DropdownMenuLabel>Previsto</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={expected}
                            onValueChange={(value) => setExpected(value)}
                          >
                            <DropdownMenuRadioItem value="30 dias">
                              30 Dias
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="60 dias">
                              60 Dias
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="90 dias">
                              90 Dias
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </th>

                    <th className="w-[8%] px-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex items-center justify-center gap-2 border border-gray-400 rounded-md py-1 px-2 hover:text-yellow-700">
                            Realizado <ChevronsUpDown size={17} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white dark:bg-slate-800 text-black dark:text-gray-300">
                          <DropdownMenuLabel>Realizado</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuRadioGroup
                            value={realized}
                            onValueChange={(value) => realizedConf(value)}
                          >
                            <DropdownMenuRadioItem value="highProgress">
                              <ArrowDown className="text-green-500 mr-3" />
                              0-40%
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="midProgress">
                              <ArrowRight className="text-yellow-500 mr-3" />
                              41-60%
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="lowProgress">
                              <ArrowUp className="text-red-500 mr-3" />
                              61-100%
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="allProgress">
                              Todos
                            </DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userPage.map((user: UserProps) => {
                    return (
                      <UserTBodyList
                        key={user.email.concat(user.id)}
                        user={user}
                        expected={expected}
                        checkedUsers={usersCheck}
                        checkUserConf={checkUserConf}
                      />
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex mt-7 w-full justify-between items-end">
              <div className="flex gap-3">
                <p className="text-sm text-gray-500 pb-3">
                  {users.length} aluno(s) cadastrados
                </p>
                {users.length !== usersFilter.length && (
                  <p className="text-sm text-gray-500 pb-3">
                    {usersFilter.length} aluno(s) nesse filtro
                  </p>
                )}
              </div>

              <div className="flex items-center text-gray-300 gap-2">
                <p>Linhas por páginas {counter}</p>
                <div className="flex flex-col items-center">
                  <button
                    className="flex items-center justify-center hover:text-yellow-700"
                    onClick={() => counterConf(counter === 1 ? 5 : counter + 5)}
                  >
                    <ChevronUp size={15} />
                  </button>
                  <button
                    className="flex items-center justify-center hover:text-yellow-700"
                    onClick={() => counterConf(counter > 5 ? counter - 5 : 1)}
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
        )}
      </ContentContainer>
    </PageContainer>
  )
}
