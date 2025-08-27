export function NotFinishedTaskToDay() {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-2">
        <h1 className="font-bold dark:text-white text-black">
          Você não concluiu nenhuma atividade neste dia.
        </h1>

        <p className="text-xs dark:text-white text-black">
          Todas as atividades planejas e não concluidas são automaticamente
          transferidas para o dia seguinte
        </p>
      </div>
    </div>
  )
}
