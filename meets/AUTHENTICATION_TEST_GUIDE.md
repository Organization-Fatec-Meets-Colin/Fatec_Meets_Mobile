# 🔐 Integração de Autenticação - Guia de Testes

## ✅ Alterações Realizadas

### 1. **AuthContext.js** - Atualizado
- ✅ Integrado com `authService.js` e `userService.js`
- ✅ Função `login()` - Autentica usuário via API
- ✅ Função `register()` - Cria novo usuário e faz login automático
- ✅ Função `logout()` - Remove token e dados do usuário
- ✅ Estado `user` - Armazena dados do usuário logado
- ✅ Estado `error` - Armazena mensagens de erro
- ✅ Estado `authIsLoading` - Indica carregamento

### 2. **LoginScreen.js** - Atualizado
- ✅ Validação de campos (email e senha)
- ✅ Validação de formato de email
- ✅ Integração com API de login
- ✅ Loading indicator durante autenticação
- ✅ Mensagens de erro
- ✅ Navegação após login bem-sucedido

### 3. **SignInScreen.js** - Atualizado
- ✅ Validação de campos (nome, email, senha, confirmação)
- ✅ Validação de formato de email
- ✅ Validação de tamanho mínimo da senha (6 caracteres)
- ✅ Validação de confirmação de senha
- ✅ Integração com API de cadastro
- ✅ Login automático após cadastro
- ✅ Loading indicator durante cadastro
- ✅ Mensagens de erro

## 🧪 Como Testar

### Pré-requisitos

1. **Backend rodando:**
   ```powershell
   cd Fatec_Meets_BackEnd\meetsbackend
   .\mvnw.cmd spring-boot:run
   ```

2. **Verificar se há dados de teste:**
   - O LoadDatabase deve estar ativo (profile `dev`)
   - Acesse: http://localhost:8080/h2-console

### Cenários de Teste

#### 📝 Teste 1: Login com Usuário Existente

**Credenciais de Teste (do LoadDatabase):**
- Email: `joao.silva@fatec.sp.gov.br`
- Senha: `password`

**Passos:**
1. Abra a tela de Login
2. Digite o email e senha acima
3. Clique em "Entrar"
4. ✅ Deve mostrar loading
5. ✅ Deve mostrar alert "Bem-vindo, João Silva!"
6. ✅ Deve navegar para tela Home

**Outros usuários de teste:**
```javascript
maria.santos@fatec.sp.gov.br - password
pedro.lima@fatec.sp.gov.br - password
ana.costa@fatec.sp.gov.br - password
carlos.mendes@fatec.sp.gov.br - password
```

#### 📝 Teste 2: Login com Credenciais Inválidas

**Passos:**
1. Abra a tela de Login
2. Digite email: `teste@teste.com`
3. Digite senha: `senhaerrada`
4. Clique em "Entrar"
5. ✅ Deve mostrar loading
6. ✅ Deve mostrar alert de erro "Email ou senha inválidos"

#### 📝 Teste 3: Validações de Login

**Teste 3.1 - Campos Vazios:**
1. Deixe os campos em branco
2. Clique em "Entrar"
3. ✅ Deve mostrar alert "Por favor, preencha todos os campos"

**Teste 3.2 - Email Inválido:**
1. Digite email sem @: `emailinvalido`
2. Digite senha: `123456`
3. Clique em "Entrar"
4. ✅ Deve mostrar alert "Por favor, insira um e-mail válido"

#### 📝 Teste 4: Criar Nova Conta

**Passos:**
1. Abra a tela de Cadastro
2. Preencha os campos:
   - Nome: `Novo Usuário`
   - Email: `novo.usuario@fatec.sp.gov.br`
   - Senha: `senha123`
   - Confirmar Senha: `senha123`
3. Clique em "Criar Conta"
4. ✅ Deve mostrar loading
5. ✅ Deve mostrar alert "Conta criada com sucesso!"
6. ✅ Deve fazer login automático
7. ✅ Deve navegar para tela Home

#### 📝 Teste 5: Validações de Cadastro

**Teste 5.1 - Campos Vazios:**
1. Deixe campos em branco
2. Clique em "Criar Conta"
3. ✅ Deve mostrar alert "Por favor, preencha todos os campos"

**Teste 5.2 - Email Inválido:**
1. Digite email sem @
2. Clique em "Criar Conta"
3. ✅ Deve mostrar alert "Por favor, insira um e-mail válido"

**Teste 5.3 - Senha Curta:**
1. Digite senha com menos de 6 caracteres: `12345`
2. Clique em "Criar Conta"
3. ✅ Deve mostrar alert "A senha deve ter no mínimo 6 caracteres"

**Teste 5.4 - Senhas Diferentes:**
1. Digite Senha: `senha123`
2. Digite Confirmar Senha: `senha456`
3. Clique em "Criar Conta"
4. ✅ Deve mostrar alert "As senhas não coincidem"

**Teste 5.5 - Email Já Cadastrado:**
1. Digite email já existente: `joao.silva@fatec.sp.gov.br`
2. Clique em "Criar Conta"
3. ✅ Deve mostrar erro de email duplicado

#### 📝 Teste 6: Persistência de Login

**Passos:**
1. Faça login com sucesso
2. Feche o app completamente
3. Reabra o app
4. ✅ Deve manter o usuário logado
5. ✅ Deve ir direto para a tela Home

#### 📝 Teste 7: Logout

**Passos:**
1. Faça login
2. Na tela Home, faça logout
3. ✅ Deve remover token do AsyncStorage
4. ✅ Deve navegar para tela de Login

## 🐛 Tratamento de Erros

### Possíveis Erros e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| "Network Error" | Backend não está rodando | Inicie o backend |
| "timeout of 10000ms exceeded" | Backend demorou muito | Verifique performance do backend |
| "Email ou senha inválidos" | Credenciais incorretas | Use credenciais do LoadDatabase |
| "Email já cadastrado" | Email duplicado | Use outro email |
| "Cannot read property 'token'" | Resposta inválida da API | Verifique estrutura da resposta |

## 🔍 Debug

### Verificar Token no AsyncStorage

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ver token salvo
const token = await AsyncStorage.getItem('meets-token');
console.log('Token:', token);

// Ver usuário salvo
const user = await AsyncStorage.getItem('meets-user');
console.log('User:', JSON.parse(user));
```

### Verificar Requisições

No backend, os logs mostrarão:
```
POST /api/auth/login - Tentativa de login: joao.silva@fatec.sp.gov.br
Login bem-sucedido: joao.silva@fatec.sp.gov.br
```

### Verificar Console do Frontend

```javascript
// LoginScreen.js / SignInScreen.js
console.log('Tentando login com:', email);
console.log('Resultado:', result);
```

## 📊 Estrutura de Dados

### Resposta do Login (API)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao.silva@fatec.sp.gov.br"
  }
}
```

### Dados Salvos no AsyncStorage

**meets-token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**meets-user:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao.silva@fatec.sp.gov.br"
}
```

## 🚀 Funcionalidades Implementadas

### AuthContext

| Propriedade/Função | Tipo | Descrição |
|-------------------|------|-----------|
| `token` | string \| null | Token JWT do usuário |
| `user` | object \| null | Dados do usuário logado |
| `authIsLoading` | boolean | Indica se está carregando |
| `error` | string \| null | Mensagem de erro |
| `login(email, senha)` | function | Faz login via API |
| `register(nome, email, senha)` | function | Cria conta e faz login |
| `logout()` | function | Remove token e dados |

### Validações Implementadas

#### Login:
- ✅ Campos não vazios
- ✅ Email com formato válido

#### Cadastro:
- ✅ Campos não vazios
- ✅ Email com formato válido
- ✅ Senha mínima de 6 caracteres
- ✅ Senhas coincidem

## 🎯 Próximos Passos

1. ✅ Implementar tela de recuperação de senha
2. ✅ Adicionar validação de CPF/RA se necessário
3. ✅ Implementar refresh token
4. ✅ Adicionar biometria/face ID
5. ✅ Implementar "Lembrar-me"

## 📝 Checklist de Validação

- [ ] Backend rodando em http://localhost:8080
- [ ] LoadDatabase com usuários de teste carregados
- [ ] Login com usuário existente funciona
- [ ] Login com credenciais inválidas mostra erro
- [ ] Validações de campos funcionam no login
- [ ] Cadastro de novo usuário funciona
- [ ] Login automático após cadastro funciona
- [ ] Validações de campos funcionam no cadastro
- [ ] Senhas diferentes mostram erro
- [ ] Loading indicators aparecem
- [ ] Mensagens de erro aparecem corretamente
- [ ] Token é salvo no AsyncStorage
- [ ] Usuário é salvo no AsyncStorage
- [ ] Persistência funciona após fechar o app
- [ ] Logout remove dados corretamente

---

**Criado em:** 08/11/2025  
**Última atualização:** 08/11/2025
