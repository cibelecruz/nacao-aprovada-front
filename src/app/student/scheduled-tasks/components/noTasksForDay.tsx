import Link from 'next/link'

export function NotTasksForDay() {
  return (
    <div className="text-center space-y-10">
      <div className="space-y-2">
        <h1 className="font-bold dark:text-white text-black">Nenhuma atividade prevista para este dia.</h1>

        <p className="text-xs dark:text-white text-black">
          A qualquer momento você poderá alterar a sua meta de estudo em: <br />
          <strong>Configurações {'>'} Editar Metas</strong> ou adicionar uma
          atividade no dia especifico
        </p>
      </div>

      <Link
        href="/student/scheduled-tasks/more-tasks"
        className="border border-zinc-500 px-4 py-1 rounded-3xl dark:text-zinc-400 text-black text-sm disabled:hover:cursor-not-allowed hover:border-zinc-400 dark:hover:text-zinc-300 transition-all"
      >
        Adicionar Atividade
      </Link>
    </div>
  )
}
