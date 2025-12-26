---
name: Landing Page Enterprise B2B
overview: Transformar a landing page de um visual generico para um SaaS Enterprise B2B profissional, com header fixo, background tech abstract animado, icones profissionais e botao Google funcional.
todos:
  - id: header-component
    content: Criar componente Header.tsx fixo com backdrop-blur e navegacao
    status: completed
  - id: mesh-gradient-css
    content: Adicionar mesh gradient animado no CSS global
    status: completed
  - id: home-hero
    content: Refatorar hero section com tipografia enterprise e badge
    status: completed
  - id: professional-icons
    content: Substituir icones por versoes linha fina profissionais
    status: completed
  - id: google-button
    content: Implementar botao Google funcional com handleGoogleLogin()
    status: completed
  - id: feature-cards
    content: Redesenhar cards com visual mais limpo e profissional
    status: completed
---

# Landing Page Enterprise B2B - Redesign Completo

## Visao Geral

Elevar o visual da Home.tsx para padrao enterprise com foco em credibilidade, profissionalismo e conversao B2B.

## Arquivos a Criar/Modificar

### 1. Novo Componente Header

**[`src/react-app/components/Header.tsx`](src/react-app/components/Header.tsx)** (NOVO):

- Header fixo com `backdrop-blur` e borda sutil
- Logo "MeetSprint AI" a esquerda com icone
- Links de navegacao: "Funcionalidades", "Precos"
- Botoes: "Login" (ghost) e "Criar Conta" (gradiente)
- Efeito de transparencia que muda ao scroll

### 2. CSS Global - Background Tech Abstract

**[`src/react-app/index.css`](src/react-app/index.css)**:

- Adicionar keyframes para animacao do mesh gradient
- Classe `.mesh-gradient-bg` com gradiente animado canto superior direito
- Cores: roxo profundo (`#4c1d95`) e azul eletrico (`#1e40af`) dissolvendo em preto

### 3. Refatoracao Completa da Home

**[`src/react-app/pages/Home.tsx`](src/react-app/pages/Home.tsx)**:**Hero Section:**

- Remover logo icone grande (infantil)
- Titulo maior e mais imponente (8xl no desktop)
- Subtitulo mais conciso e profissional
- Badge "Enterprise-ready" acima do titulo

**Icones Profissionais (linha fina):**

- `AudioWaveform` ou `Mic` - Gravacao/Onda Sonora
- `ClipboardCheck` ou `ListChecks` - Processamento/Checklist  
- `Kanban` ou `LayoutGrid` - Gestao de Sprints

**Botao Google Funcional:**

- Elemento `<button>` real com `onClick`
- Funcao `handleGoogleLogin()` com comentario para Google Client ID
- Estados hover/active com glow intensificado
- Icone do Google (SVG inline)

**Cards de Features:**

- Bordas mais sutis
- Icones de linha fina (stroke-width: 1.5)
- Remover gradientes coloridos dos icones (usar branco/cinza)

### 4. Estrutura Visual

```javascript
+--------------------------------------------------+
|  [Logo] MeetSprint AI    Features | Pricing | Login | [Criar Conta] |
+--------------------------------------------------+
|                                                  |
|     [mesh gradient animado no canto direito]     |
|                                                  |
|            Enterprise-ready                      |
|                                                  |
|         MeetSprint AI                            |
|    (titulo 8xl, bold, gradiente)                 |
|                                                  |
|    Subtitulo profissional e conciso              |
|                                                  |
|    [G] Continuar com Google    [Agendar Demo]    |
|                                                  |
|    +----------+ +----------+ +----------+        |
|    | Gravacao | | Tasks IA | | Sprints  |        |
|    +----------+ +----------+ +----------+        |
|                                                  |
|    Logos de empresas / Social proof              |
+--------------------------------------------------+
```



## Paleta Enterprise

```javascript
Background:
- Base: #000000
- Mesh Roxo: #4c1d95 (violet-900)
- Mesh Azul: #1e40af (blue-800)

Texto:
- Titulo: #ffffff com gradiente sutil
- Corpo: #a1a1aa (mais claro que antes)

Accent:
- Primario: #8b5cf6 (violet-500)
- Hover: #a78bfa (violet-400)

```