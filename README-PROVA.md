# Sistema de Provas Online

Sistema profissional para aplicação e correção de provas educacionais desenvolvido com Next.js, React e TypeScript.

## 🚀 Características

- ✅ **Identificação de aluno** com validação de nome
- ⏱️ **Countdown sincronizado** com horário do servidor
- 📄 **Visualização de PDF** da prova com controles de zoom e navegação
- 📝 **Formulário dinâmico** de questões com 5 alternativas (A-E)
- 🔀 **Randomização determinística** de questões e alternativas por aluno
- 💾 **Salvamento automático** de respostas no localStorage
- 📊 **Resultado imediato** com visualização profissional
- 🎨 **Design moderno** em tons de cinza neutros
- 📱 **Responsivo** com grid layout e rolagem independente

## 🛠️ Tecnologias

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS 4**
- **react-pdf** para visualização de PDFs
- **zod** para validação de schemas
- **date-fns** para manipulação de datas

## 📁 Estrutura do Projeto

```
app/
├── prova/
│   ├── page.tsx           # Identificação do aluno
│   ├── espera/            # Countdown até liberação
│   ├── realizar/          # Grid: PDF + formulário
│   └── resultado/         # Apresentação de resultados
├── api/prova/
│   ├── status/            # Status e horário de liberação
│   ├── questoes/          # Lista de questões
│   ├── verificar-envio/   # Validação de envio
│   └── enviar/            # Submissão e correção
components/prova/
├── countdown-timer.tsx    # Timer regressivo
├── questao-item.tsx       # Questão com alternativas
├── resultado-card.tsx     # Card de resultado
└── ...
lib/
├── types.ts               # Tipos TypeScript
├── utils.ts               # Funções utilitárias
├── schemas.ts             # Schemas Zod
└── hooks/
    └── useProvaStorage.ts # Hook de localStorage
```

## 🚦 Como Usar

### Desenvolvimento

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Colocar PDF da prova:**
   - Adicione seu arquivo PDF em `public/prova.pdf`

3. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

4. **Acessar aplicação:**
   - Abra [https://sisnet-api.jbmiranda.ddns.net](https://sisnet-api.jbmiranda.ddns.net)

### Fluxo do Aluno

1. **Página inicial** → Clicar em "Acessar Prova"
2. **Identificação** → Inserir nome completo
3. **Espera** → Aguardar countdown até horário de liberação
4. **Realização** → Visualizar PDF e responder questões
5. **Resultado** → Ver nota e detalhes da correção

## 🔧 Configuração das APIs

### Status da Prova
`GET /api/prova/status`

Configure o horário de liberação em `/app/api/prova/status/route.ts`:
```typescript
const liberadaEm = new Date(2026, 1, 11, 14, 0, 0); // 11/02/2026 às 14:00
```

### Questões
`GET /api/prova/questoes`

Configure o número de questões em `/app/api/prova/questoes/route.ts`:
```typescript
const questoes = Array.from({ length: 20 }, ...); // 20 questões
```

### Gabarito
`POST /api/prova/enviar`

Configure o gabarito em `/app/api/prova/enviar/route.ts`:
```typescript
const gabarito: Record<string, string> = {
  '01': 'a', '02': 'b', '03': 'c', // ...
};
```

## 🎲 Randomização

A randomização é **determinística** baseada no nome do aluno:
- Mesmo nome = mesma ordem de questões e alternativas
- Nomes diferentes = ordens diferentes
- Garante consistência em recarregamentos

Implementado via:
- `seedRandom(nome)` - gera seed numérica
- `shuffleWithSeed(array, seed)` - embaralha com seed

## 💾 LocalStorage

Dados salvos automaticamente:
- `prova:aluno` - Nome do aluno
- `prova:respostas` - Respostas das questões
- `prova:resultado` - Resultado da correção

## 🎨 Design

- **Paleta:** Tons de cinza neutros (neutral-50 a neutral-900)
- **Tipografia:** Geist Sans (clara e profissional)
- **Layout:** Grid 2:1 (PDF maior, formulário menor)
- **Responsividade:** Stack vertical em mobile
- **Animações:** Suaves e discretas

## 📝 Próximas Melhorias

- [ ] Implementar banco de dados real
- [ ] Adicionar autenticação
- [ ] Gerar comprovante em PDF
- [ ] Adicionar modo dark
- [ ] Timer de duração da prova
- [ ] Histórico de tentativas
- [ ] Dashboard administrativo
- [ ] Exportação de resultados
- [ ] Upload de imagens nas questões

## 📄 Licença

Projeto educacional - Uso livre.
