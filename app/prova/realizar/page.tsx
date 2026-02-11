"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useProvaStorage } from "@/lib/hooks/useProvaStorage";
import { QuestaoItem } from "@/components/prova/questao-item";
import { LoadingSpinner } from "@/components/prova/loading-spinner";
import { ErrorMessage } from "@/components/prova/error-message";
import { ModalConfirmacao } from "@/components/prova/modal-confirmacao";
import { seedRandom, shuffleWithSeed } from "@/lib/utils";
import type {
  Questao,
  QuestoesResponse,
  Resposta,
  ResultadoProva,
} from "@/lib/types";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Importar react-pdf dinamicamente apenas no cliente
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false },
);

const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

export default function RealizarProvaPage() {
  const router = useRouter();
  const { aluno, respostas, saveResposta, clearRespostas, saveResultado } =
    useProvaStorage();

  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [showModal, setShowModal] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Seed baseada no nome do aluno para randomização determinística
  const seed = useMemo(() => {
    return aluno ? seedRandom(aluno) : 0;
  }, [aluno]);

  // Questões embaralhadas
  const questoesEmbaralhadas = useMemo(() => {
    return shuffleWithSeed(questoes, seed);
  }, [questoes, seed]);

  // Configurar worker do PDF.js apenas no cliente
  useEffect(() => {
    setIsMounted(true);

    // Configurar worker
    import("react-pdf").then((pdfjs) => {
      pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  // Verificar se aluno está identificado
  useEffect(() => {
    if (!aluno) {
      router.push("/prova");
    }
  }, [aluno, router]);

  // Buscar questões da prova
  useEffect(() => {
    async function fetchQuestoes() {
      try {
        const response = await fetch("/api/prova/questoes");
        if (!response.ok) {
          throw new Error("Erro ao buscar questões");
        }
        const data: QuestoesResponse = await response.json();
        setQuestoes(data.questoes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestoes();
  }, []);

  const handleRespostaChange = (questao: string, resposta: string) => {
    saveResposta(questao, resposta);
  };

  const handleFinalizar = () => {
    setShowModal(true);
  };

  const handleConfirmarEnvio = async () => {
    setEnviando(true);

    try {
      // Verificar se pode enviar
      const verificarResponse = await fetch("/api/prova/verificar-envio");
      if (!verificarResponse.ok) {
        throw new Error("Erro ao verificar disponibilidade de envio");
      }
      const verificarData = await verificarResponse.json();

      if (!verificarData.podeEnviar) {
        throw new Error(
          verificarData.motivo || "Não é possível enviar a prova no momento",
        );
      }

      // Preparar respostas para envio
      const respostasArray: Resposta[] = Object.entries(respostas).map(
        ([questao, resposta]) => ({
          questao,
          resposta,
        }),
      );

      // Enviar prova
      const enviarResponse = await fetch("/api/prova/enviar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aluno,
          respostas: respostasArray,
        }),
      });

      if (!enviarResponse.ok) {
        throw new Error("Erro ao enviar prova");
      }

      const resultado: ResultadoProva = await enviarResponse.json();

      // Salvar resultado e limpar respostas
      saveResultado(resultado);
      clearRespostas();

      // Redirecionar para resultado
      router.push("/prova/resultado");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar prova");
      setShowModal(false);
    } finally {
      setEnviando(false);
    }
  };

  const questoesRespondidas = Object.keys(respostas).length;
  const totalQuestoes = questoes.length;
  const todasRespondidas = questoesRespondidas === totalQuestoes;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-md">
          <ErrorMessage message={error} />
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid h-screen grid-cols-1 bg-zinc-50 lg:grid-cols-[2fr_1fr]">
        {/* Lado Esquerdo - PDF */}
        <div className="flex flex-col overflow-hidden border-r border-neutral-200 bg-neutral-100">
          {/* Controles do PDF */}
          <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                disabled={pageNumber <= 1}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ←
              </button>
              <span className="text-sm text-neutral-700">
                Página {pageNumber} de {numPages}
              </span>
              <button
                onClick={() =>
                  setPageNumber((prev) => Math.min(prev + 1, numPages))
                }
                disabled={pageNumber >= numPages}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                →
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.5))}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                −
              </button>
              <span className="text-sm text-neutral-700">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((prev) => Math.min(prev + 0.1, 2.0))}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Visualizador do PDF */}
          <div className="flex-1 overflow-auto p-4">
            <div className="flex justify-center">
              {isMounted ? (
                <Document
                  file="/prova.pdf"
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={
                    <div className="flex items-center justify-center py-12">
                      <LoadingSpinner size="lg" />
                    </div>
                  }
                  error={
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
                      Erro ao carregar PDF
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="flex flex-col overflow-hidden bg-white">
          {/* Header fixo */}
          <div className="border-b border-neutral-200 bg-white p-4">
            <div className="mb-2">
              <label className="block text-xs font-medium text-neutral-600">
                Aluno
              </label>
              <input
                type="text"
                value={aluno || ""}
                disabled
                className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2">
              <span className="text-sm font-medium text-neutral-700">
                Progresso
              </span>
              <span className="text-sm font-semibold text-neutral-900">
                {questoesRespondidas} / {totalQuestoes}
              </span>
            </div>
          </div>

          {/* Lista de questões com scroll */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {questoesEmbaralhadas.map((questao) => (
                <QuestaoItem
                  key={questao.numero}
                  numero={questao.numero}
                  resposta={respostas[questao.numero]}
                  onChange={(letra) =>
                    handleRespostaChange(questao.numero, letra)
                  }
                  seed={seed}
                />
              ))}
            </div>
          </div>

          {/* Footer fixo */}
          <div className="border-t border-neutral-200 bg-white p-4">
            {!todasRespondidas && (
              <p className="mb-3 text-xs text-amber-600">
                ⚠️ Você ainda não respondeu todas as questões
              </p>
            )}
            <button
              onClick={handleFinalizar}
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
            >
              Finalizar e Enviar Prova
            </button>
          </div>
        </div>
      </div>

      {/* Modal de confirmação */}
      <ModalConfirmacao
        isOpen={showModal}
        title="Finalizar Prova"
        message={`Você respondeu ${questoesRespondidas} de ${totalQuestoes} questões. Tem certeza de que deseja finalizar e enviar a prova? Esta ação não pode ser desfeita.`}
        confirmText={enviando ? "Enviando..." : "Sim, finalizar"}
        cancelText="Cancelar"
        onConfirm={handleConfirmarEnvio}
        onCancel={() => setShowModal(false)}
        variant="default"
      />
    </>
  );
}
