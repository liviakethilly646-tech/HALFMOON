# 🎬 CineRegistry - Sistema de Catálogo de Cinema

[![Node.js](https://shields.io)](https://nodejs.org)
[![Express](https://shields.io)](https://expressjs.com)
[![Handlebars](https://shields.io)](https://handlebarsjs.com)
[![Halfmoon Framework](https://shields.io)](https://gethalfmoon.com)

O **CineRegistry** é uma aplicação web completa (Full-Stack) voltada para o cadastro e gerenciamento de um catálogo cinematográfico. O sistema permite o controle e mapeamento de relações entre **Artistas, Diretores e Filmes**.

A interface foi projetada utilizando o **Halfmoon Framework v2.0.2** injetado via CDN, combinado com folhas de estilo customizadas para oferecer uma experiência fluida de navegação com suporte a temas.

---

## 🌗 Sistema Dinâmico de Temas (Modo Claro / Escuro)

O projeto conta com uma arquitetura de visualização que simula uma transição completa de ambiente controlada diretamente pelo servidor:
- **Modo Claro (Teal & White):** Interface iluminada baseada em gradientes suaves de verde-turquesa e branco.
- **Modo Escuro (Teal & Black):** Visual imersivo com alto contraste para ambientes com pouca luz.
- A alternância ocorre de forma persistente através de rotas espelhadas gerenciadas no Express (ex: `/artistas` renderiza o Modo Claro e `/artistas2` renderiza o Modo Escuro).

---

## 🎨 Componentes e Estruturas Implementadas

Com o auxílio do Halfmoon e estilizações baseadas em CSS Flexbox, as seguintes estruturas foram implementadas:

*   **Cards de Cadastro:** Containers centrais flutuantes com sombras suaves (`box-shadow`), bordas arredondadas e designs adaptados para entradas de dados.
*   **Formulários de Relacionamento:** Estruturas que permitem associar dados complexos, como múltiplos Artistas selecionáveis (`select multiple`) e Diretores específicos no momento da criação de um Filme.
*   **Listagens Dinâmicas:** Exibição estruturada dos registros vindos do banco de dados, renderizados na página através do laço `{{#each}}` do Handlebars.
*   **Navegação Flutuante:** Links posicionados estrategicamente via CSS (`position: absolute`) para garantir o fluxo rápido de "Voltar" ou "Alternar Tema" sem quebrar o layout.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** — Ambiente de execução JavaScript no servidor.
- **Express** — Framework web para gerenciamento de rotas e requisições HTTP (POST/GET).
- **Handlebars (HBS)** — Motor de template para renderização dinâmica de páginas HTML no lado do servidor.
- **Halfmoon v2.0.2** — Framework de UI para base estrutural do sistema de estilos.
- **Font Awesome 6.5.2** — Biblioteca para elementos iconográficos.
- **CSS3 Personalizado** — Alinhamento moderno com Flexbox e gradientes lineares de fundo.

---

## 📦 Como Executar o Projeto

Certifique-se de ter o [Node.js](https://nodejs.org) instalado em sua máquina.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd seu-repositorio
   ```

3. **Instale as dependências do ecossistema:**
   ```bash
   npm install
   ```

4. **Inicie o servidor local:**
   Se você configurou o `nodemon` ou o script padrão no `package.json`:
   ```bash
   npm start
   ```
   *Ou execute diretamente pelo Node:*
   ```bash
   node app.js
   ```

5. **Acesse no navegador:**
   Abra o endereço [http://localhost:3000](http://localhost:3000) (ou a porta padrão que configurou no seu arquivo principal).

---

## 📄 Licença

Este projeto está sob a licença MIT.
