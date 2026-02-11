import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-2xl text-center">
        {/* Logo/Ícone */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-900 shadow-lg">
            <svg
              className="h-12 w-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900">
          Sistema de Provas Online
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-neutral-600">
          Plataforma profissional para aplicação e correção de provas educacionais
        </p>

        {/* Card principal */}
        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold text-neutral-900">
            Bem-vindo ao Portal de Provas
          </h2>

          <div className="mb-8 space-y-4">
            <div className="flex items-start gap-3 text-left">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <span className="text-sm font-semibold text-neutral-900">1</span>
              </div>
              <div>
                <p className="font-medium text-neutral-900">Identifique-se</p>
                <p className="text-sm text-neutral-600">Insira seu nome completo para começar</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <span className="text-sm font-semibold text-neutral-900">2</span>
              </div>
              <div>
                <p className="font-medium text-neutral-900">Aguarde a liberação</p>
                <p className="text-sm text-neutral-600">
                  A prova será liberada no horário programado
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <span className="text-sm font-semibold text-neutral-900">3</span>
              </div>
              <div>
                <p className="font-medium text-neutral-900">Realize a prova</p>
                <p className="text-sm text-neutral-600">
                  Responda as questões e finalize quando terminar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <span className="text-sm font-semibold text-neutral-900">4</span>
              </div>
              <div>
                <p className="font-medium text-neutral-900">Veja seu resultado</p>
                <p className="text-sm text-neutral-600">Resultado disponível imediatamente</p>
              </div>
            </div>
          </div>

          <Link
            href="/prova"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Acessar Prova
          </Link>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-neutral-900">Requisitos técnicos</h3>
          <ul className="space-y-2 text-left text-sm text-neutral-600">
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Conexão estável com a internet</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Navegador moderno (Chrome, Firefox, Edge ou Safari)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>JavaScript habilitado</span>
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-400">•</span>
              <span>Tela de pelo menos 1024x768 pixels (recomendado)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
