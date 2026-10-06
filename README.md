# 🗺️ LeadMap — Plataforma de Prospecção de Leads com Google Maps & IA

Plataforma web moderna e completa para **descobrir, qualificar e contatar negócios locais** sem site próprio e com alta demanda reprimida, integrando **Google Places API (New)** e **Inteligência Artificial (Claude)**.

---

## ✨ Funcionalidades Principais (Etapas 1 a 3)

- **🎨 Design System Apple iOS ("Liquid Glass")**:
  - Glassmorphism com `backdrop-filter: blur(20px)` e superfícies translúcidas.
  - Tipografia SF Pro Display / Text com hierarquia nativa da Apple.
  - Sidebar translúcida para Desktop e Floating Tab Bar para Mobile.
  - Suporte completo a Modo Claro e Escuro automático.

- **📊 Dashboard Central**:
  - Cards de métricas operacionais (Total de Leads, Leads sem Site, Contatados, Reuniões/Fechamentos).
  - Gráficos interativos com **Recharts** (Volume de Leads por dia e Distribuição por Nicho).
  - Visão consolidada do fluxo do funil de vendas.

- **🔍 Busca Inteligente no Google Maps**:
  - Modos de busca por Cidade/Bairro ou por Raio em quilômetros.
  - Chips com atalhos de nichos de alta conversão (Dentista, Pet Shop, Pizzaria, Academia, etc.).
  - Integração direta com a **Places API (New)** da Google.

- **🎯 Filtros Avançados de Qualificação**:
  - **Filtro "Sem Site" (Destaque)**: identifica estabelecimentos sem website cadastrado (o melhor perfil para venda de criação de site).
  - **Filtro WhatsApp (9...)**: normalização via `libphonenumber-js`, filtrando apenas celulares reais para abordagem direta.
  - Ordenação por **Score de Oportunidade (0 a 100)**, notas e volume de avaliações.

- **🤖 Inteligência Comercial com Claude**:
  - Geração de resumo do negócio e oportunidade comercial em 2-3 frases.
  - Sugestão automática de **"Ângulo de abordagem"** personalizado para início de conversa no WhatsApp.
  - Botão de abertura rápida de conversa com mensagem pronta no WhatsApp (`wa.me`).

---

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui tokens, Lucide Icons, Recharts.
- **State Management**: TanStack Query v5 + Zustand v5.
- **Mapas & Dados**: Google Places API (New) e Geocoding API.
- **Inteligência Artificial**: Anthropic SDK (Claude).
- **Validação & Utilitários**: Zod, `libphonenumber-js`.

---

## 🚀 Instalação e Execução

### 1. Clonar o repositório
```bash
git clone https://github.com/KKousado/LeadMap.git
cd LeadMap
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo e preencha suas chaves:
```bash
cp .env.example .env.local
```

Variáveis necessárias:
```env
GOOGLE_MAPS_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSy...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Instalar dependências e rodar
```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.
