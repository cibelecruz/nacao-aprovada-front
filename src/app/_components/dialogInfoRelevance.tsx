import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/_components/ui/accordion'

import { FireSVG } from './icons/fire'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

interface DialogInfoRelevance {
  relevance: number
}

export default function DialogInfoRelevance({
  relevance,
}: DialogInfoRelevance) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="border border-transparent w-max h-max flex items-center gap-2 bg-blue-950/50 px-2 py-0.5 rounded-xl">
          <FireSVG />
          <p>{String(relevance)}</p>
        </span>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-[#050c16] text-black dark:text-white w-full border-none rounded-3xl lg:w-1/2">
        <DialogHeader>
          <DialogTitle className="text-bold text-yellow-600 text-left">
            Indicador de Relevância
          </DialogTitle>
        </DialogHeader>

        <Accordion type="multiple">
          <AccordionItem
            value="relevance-5"
            className="space-y-4 border-zinc-700"
          >
            <AccordionTrigger
              onChange={(e) => e.stopPropagation()}
              className="flex justify-between w-80 no-underline"
            >
              <div className="flex w-full justify-between pr-4 font-bold">
                <p>Altíssima</p>
                <div className="flex gap-1">
                  <FireSVG />
                  <FireSVG />
                  <FireSVG />
                  <FireSVG />
                  <FireSVG />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="w-80 font-bold text-lg px-2">
              <p>
                Este assunto aparece em quase todas as provas e deve ser
                frenquentemente estudado
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="relevance-4"
            className="space-y-4 border-zinc-700"
          >
            <AccordionTrigger className="flex justify-between w-80 no-underline">
              <div className="flex w-full justify-between pr-4 font-bold">
                Alta
                <div className="flex gap-1">
                  <FireSVG />
                  <FireSVG />
                  <FireSVG />
                  <FireSVG />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="w-80 font-bold text-lg px-2">
              <p>
                Este assunto aparece regularmente nas provas e devem ser
                estudados com muita atenção
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="relevance-3"
            className="space-y-4 border-zinc-700"
          >
            <AccordionTrigger className="flex justify-between w-80 no-underline">
              <div className="flex w-full justify-between pr-4 font-bold">
                Média
                <div className="flex gap-1">
                  <FireSVG />
                  <FireSVG />
                  <FireSVG />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="w-80 font-bold text-lg px-2">
              <p>
                Este assunto aparece de forma moderada nas provas. São
                relevantes, mas não são garantidos em todas as provas
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="relevance-2"
            className="space-y-4 border-zinc-700"
          >
            <AccordionTrigger className="flex justify-between w-80 no-underline">
              <div className="flex w-full justify-between pr-4 font-bold">
                Baixa
                <div className="flex gap-1">
                  <FireSVG />
                  <FireSVG />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="w-80 font-bold text-lg px-2">
              <p>
                Este assunto aparece pouco nas provas e pode não ser prioritário
                para o seu estudo
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="relevance-1"
            className="space-y-4 border-zinc-700"
          >
            <AccordionTrigger className="flex justify-between w-80 no-underline">
              <div className="flex w-full justify-between pr-4 font-bold">
                Rara
                <div className="flex gap-1">
                  <FireSVG />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="w-80 font-bold text-lg px-2">
              <p>Este assunto aparece de forma muito ocasional nas provas.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <DialogFooter className="ml-auto">
          <DialogClose asChild>
            <button className="text-sm font-bold text-black dark:text-blue-300">Fechar</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
