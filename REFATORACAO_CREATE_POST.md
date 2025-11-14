# Refatoração: CreatePostScreen

## 📋 Visão Geral

Este documento detalha a refatoração completa do componente `CreatePostScreen.js`, realizada para melhorar a manutenibilidade do código através de:
- **Documentação abrangente** com comentários JSDoc e inline
- **Componentização** extraindo funcionalidades em componentes reutilizáveis
- **Organização** estruturando o código de forma lógica e clara

---

## 🎯 Objetivos Alcançados

### ✅ Documentação
- Adicionado JSDoc completo no cabeçalho do componente
- Comentários inline explicando cada estado
- Documentação detalhada de todas as funções
- Seções do JSX comentadas com descrições claras

### ✅ Componentização
Criados 3 novos componentes reutilizáveis:

1. **EventForm.js** - Formulário de eventos
2. **ImagePreview.js** - Preview de imagens
3. **PostActions.js** - Botões de ação

### ✅ Organização
- Estados organizados em seções lógicas (POST, EVENTO, PICKERS)
- Estilos comentados e organizados por categoria
- Imports otimizados removendo dependências movidas

---

## 📦 Componentes Criados

### 1. EventForm.js
**Localização:** `src/components/EventForm.js`

**Responsabilidade:** Gerenciar todo o formulário de criação de eventos.

**Props:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `eventoData` | Object | Dados do evento (data, horário, local, etc) |
| `setEventoData` | Function | Atualiza os dados do evento |
| `showDatePicker` | Boolean | Controla exibição do picker de data |
| `setShowDatePicker` | Function | Atualiza estado do picker de data |
| `showTimeInicioPicker` | Boolean | Controla exibição do picker de horário inicial |
| `setShowTimeInicioPicker` | Function | Atualiza estado do picker de horário inicial |
| `showTimeFimPicker` | Boolean | Controla exibição do picker de horário final |
| `setShowTimeFimPicker` | Function | Atualiza estado do picker de horário final |

**Funcionalidades:**
- DateTimePicker para data (com validação de data mínima = hoje)
- DateTimePicker para horário de início
- DateTimePicker para horário de fim
- StylizedInput para local (obrigatório)
- StylizedInput para endereço (opcional)
- StylizedInput para capacidade máxima (opcional, apenas números)
- Comportamento específico por plataforma (iOS vs Android)

**Dependências:**
- `@react-native-community/datetimepicker`
- `StylizedInput`
- `FontAwesome`

---

### 2. ImagePreview.js
**Localização:** `src/components/ImagePreview.js`

**Responsabilidade:** Exibir preview das imagens selecionadas com opção de remover.

**Props:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `imagens` | Array | Array de objetos com URIs das imagens |
| `onRemove` | Function | Callback para remover imagem (recebe o índice) |

**Funcionalidades:**
- Exibição horizontal em ScrollView
- Thumbnails de 120x120 pixels
- Botão de remover com ícone `times-circle`
- Renderização condicional (não renderiza se não há imagens)

**Dependências:**
- `expo-image`
- `FontAwesome`

---

### 3. PostActions.js
**Localização:** `src/components/PostActions.js`

**Responsabilidade:** Botões de ação para adicionar foto e alternar modo evento.

**Props:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| `imagensCount` | Number | Quantidade atual de imagens selecionadas |
| `onPickImage` | Function | Callback para abrir seletor de imagens |
| `isEvento` | Boolean | Estado atual do modo evento |
| `onToggleEvento` | Function | Callback para alternar modo evento |

**Funcionalidades:**
- **Botão Foto:**
  - Mostra contador "Foto (X/5)" quando há imagens
  - Desabilita quando atinge 5 imagens
  - Estilo ativo (cor #9C2222) quando pode adicionar
  - Estilo desabilitado (cor #ccc) quando no limite

- **Botão Evento:**
  - Alterna entre ativo/inativo
  - Cor muda de acordo com estado (vermelho quando inativo, cinza quando ativo)
  - Visual feedback claro do estado atual

**Dependências:**
- `FontAwesome`

---

## 🔄 Mudanças no CreatePostScreen.js

### Antes da Refatoração
- ~570 linhas de código
- Pouca documentação
- Lógica inline no JSX
- Difícil manutenção

### Depois da Refatoração
- ~350 linhas de código
- Documentação completa
- Componentes extraídos
- Código organizado e legível

### Estrutura de Comentários

#### 1. Cabeçalho do Componente
```javascript
/**
 * Tela de criação de postagens e eventos
 * 
 * Permite ao usuário criar posts com as seguintes funcionalidades:
 * - Criar postagens com título e conteúdo
 * - Adicionar até 5 imagens
 * - Criar eventos com data, horário, local e capacidade
 * - Vincular imagens a eventos
 * 
 * Validações:
 * - Título e conteúdo obrigatórios
 * - Local obrigatório para eventos
 * - Data mínima do evento: hoje
 * - Limite de 5 imagens por post
 */
```

#### 2. Estados Organizados
```javascript
// ========== ESTADOS DO POST ==========
// ========== ESTADOS DO EVENTO ==========
// ========== CONTROLE DE PICKERS ==========
```

#### 3. Funções Documentadas
Todas as funções possuem:
- JSDoc explicando propósito
- Parâmetros documentados
- Fluxo detalhado em comentários inline

Exemplo:
```javascript
/**
 * Manipula a criação da postagem/evento
 * 
 * Fluxo:
 * 1. Valida campos obrigatórios
 * 2. Monta FormData com texto, imagens e dados do evento
 * 3. Formata datas/horários para o padrão do backend
 * 4. Envia para o backend via service
 * 5. Limpa o formulário e retorna à tela anterior
 */
```

#### 4. JSX Comentado
Cada seção do JSX possui comentário explicativo:
```javascript
{/* ========== CABEÇALHO ========== */}
{/* ========== INFORMAÇÕES DO USUÁRIO ========== */}
{/* ========== CAMPO DE TÍTULO ========== */}
```

---

## 🎨 Estilos

### Organização
Estilos reorganizados em categorias:
- Container Principal
- Cabeçalho
- Área de Rolagem
- Informações do Usuário
- Inputs de Texto
- Rodapé

### Limpeza
Removidos estilos que foram movidos para os componentes:
- Estilos de preview de imagens → `ImagePreview.js`
- Estilos de formulário de evento → `EventForm.js`
- Estilos de botões de ação → `PostActions.js`

---

## 📊 Comparação de Complexidade

### Antes
```
CreatePostScreen.js
├── 570 linhas
├── Toda lógica inline
├── Estados misturados
├── Estilos misturados
└── Sem documentação
```

### Depois
```
CreatePostScreen.js (350 linhas)
├── Documentação completa
├── Estados organizados
├── Componentes extraídos
└── Estilos organizados

EventForm.js (200 linhas)
├── Lógica de evento isolada
├── DateTimePickers gerenciados
└── Validações específicas

ImagePreview.js (60 linhas)
├── Preview isolado
└── Lógica de remoção

PostActions.js (80 linhas)
├── Botões de ação
└── Estados visuais
```

---

## 🚀 Benefícios

### Para Desenvolvimento
✅ **Reutilização:** Componentes podem ser usados em outras telas  
✅ **Manutenção:** Mais fácil localizar e corrigir bugs  
✅ **Testes:** Componentes menores são mais fáceis de testar  
✅ **Legibilidade:** Código mais claro e organizado  

### Para Novos Desenvolvedores
✅ **Onboarding:** Documentação facilita entendimento  
✅ **Contexto:** Comentários explicam o "porquê" de cada decisão  
✅ **Navegação:** Organização lógica facilita encontrar código  
✅ **Padrões:** Estrutura consistente serve como referência  

---

## 📝 Checklist de Refatoração

- [x] Adicionar JSDoc ao componente principal
- [x] Organizar estados em seções lógicas
- [x] Comentar todas as funções
- [x] Extrair EventForm para componente
- [x] Extrair ImagePreview para componente
- [x] Extrair PostActions para componente
- [x] Atualizar imports
- [x] Substituir JSX inline por componentes
- [x] Comentar seções do JSX
- [x] Organizar e comentar estilos
- [x] Remover estilos não utilizados
- [x] Validar ausência de erros

---

## 🔍 Validação

Todos os arquivos foram validados e não apresentam erros:
- ✅ CreatePostScreen.js
- ✅ EventForm.js
- ✅ ImagePreview.js
- ✅ PostActions.js

---

## 📚 Referências

### Arquivos Modificados
- `src/screens/private/CreatePostScreen.js` - Componente principal refatorado

### Arquivos Criados
- `src/components/EventForm.js` - Novo componente
- `src/components/ImagePreview.js` - Novo componente
- `src/components/PostActions.js` - Novo componente

### Dependências Utilizadas
- `@react-native-community/datetimepicker` - Seletor de data/hora nativo
- `expo-image-picker` - Seletor de imagens
- `expo-image` - Componente otimizado de imagem
- `@expo/vector-icons` - Ícones (FontAwesome)

---

## 🎓 Lições Aprendidas

### Componentização
- Componentes devem ter uma única responsabilidade
- Props devem ser claramente documentadas
- Estilos devem ser encapsulados junto com o componente

### Documentação
- JSDoc facilita entendimento sem precisar ler implementação
- Comentários inline explicam decisões técnicas
- Organização visual (seções) melhora navegação

### Organização
- Estados relacionados devem estar agrupados
- Funções devem estar próximas de onde são usadas
- Estilos devem seguir a ordem dos elementos no JSX

---

**Documento criado em:** Janeiro 2025  
**Autor:** Equipe Fatec Meets  
**Versão:** 1.0
