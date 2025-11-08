# 📡 Services da API - Fatec Meets

Este diretório contém todos os services para comunicação com a API backend do Fatec Meets.

## 📁 Estrutura

```
service/
├── index.js                # Export centralizado de todos os services
├── authService.js          # Autenticação (login/token)
├── userService.js          # Gerenciamento de usuários
├── postagemService.js      # Gerenciamento de postagens
├── comentarioService.js    # Gerenciamento de comentários
├── eventoService.js        # Gerenciamento de eventos
├── denunciaService.js      # Gerenciamento de denúncias
└── instituicaoService.js   # Gerenciamento de instituições
```

## 🚀 Como Usar

### Importação Individual

```javascript
import { login } from '../service/authService';
import { listPostagens, createPostagem } from '../service/postagemService';
import { getUserById } from '../service/userService';
```

### Importação Centralizada

```javascript
import { 
    login, 
    listPostagens, 
    createPostagem,
    getUserById 
} from '../service';
```

## 📚 Documentação dos Services

### 🔐 AuthService

Gerencia autenticação de usuários.

```javascript
import { login, saveToken, getToken, removeToken, isAuthenticated } from '../service/authService';

// Login
const handleLogin = async () => {
    try {
        const response = await login('joao.silva@fatec.sp.gov.br', 'password');
        saveToken(response.token);
        console.log('Usuário:', response.usuario);
    } catch (error) {
        console.error('Erro no login:', error);
    }
};

// Verificar autenticação
if (isAuthenticated()) {
    console.log('Usuário autenticado');
}

// Logout
removeToken();
```

**Endpoints:**
- `POST /api/auth/login` - Login de usuário

**Resposta do Login:**
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

---

### 👤 UserService

Gerencia usuários do sistema.

```javascript
import { listUsers, getUserById, createUser, updateUser, deleteUser } from '../service/userService';

// Listar usuários
const usuarios = await listUsers({ page: 0, size: 20, paginado: false });

// Buscar usuário por ID
const usuario = await getUserById(1);

// Criar usuário
const novoUsuario = await createUser({
    nome: 'João Silva',
    email: 'joao@fatec.sp.gov.br',
    senha: 'senha123',
    bio: 'Desenvolvedor Full Stack'
});

// Atualizar usuário
const atualizado = await updateUser(1, { bio: 'Nova bio' });

// Excluir usuário
await deleteUser(1);
```

**Endpoints:**
- `GET /api/usuarios` - Listar usuários
- `GET /api/usuarios/{id}` - Buscar por ID
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/{id}` - Atualizar usuário
- `DELETE /api/usuarios/{id}` - Excluir usuário

---

### 📝 PostagemService

Gerencia postagens.

```javascript
import { listPostagens, getPostagemById, createPostagem, updatePostagem, deletePostagem } from '../service/postagemService';

// Listar todas as postagens
const postagens = await listPostagens();

// Buscar postagem por ID
const postagem = await getPostagemById(1);

// Criar postagem
const novaPostagem = await createPostagem({
    titulo: 'Minha primeira postagem',
    conteudo: 'Conteúdo da postagem',
    usuario: { id: 1 }
});

// Atualizar postagem
const atualizada = await updatePostagem(1, {
    titulo: 'Título atualizado',
    conteudo: 'Novo conteúdo'
});

// Excluir postagem
await deletePostagem(1);
```

**Endpoints:**
- `GET /api/postagens` - Listar postagens
- `GET /api/postagens/{id}` - Buscar por ID
- `POST /api/postagens` - Criar postagem
- `PUT /api/postagens/{id}` - Atualizar postagem
- `DELETE /api/postagens/{id}` - Excluir postagem

---

### 💬 ComentarioService

Gerencia comentários em postagens.

```javascript
import { listComentarios, getComentarioById, createComentario, deleteComentario } from '../service/comentarioService';

// Listar todos os comentários
const comentarios = await listComentarios();

// Buscar comentário por ID
const comentario = await getComentarioById(1);

// Criar comentário
const novoComentario = await createComentario({
    conteudo: 'Ótima postagem!',
    postagem: { id: 1 },
    usuario: { id: 1 }
});

// Excluir comentário
await deleteComentario(1);
```

**Endpoints:**
- `GET /api/comentarios` - Listar comentários
- `GET /api/comentarios/{id}` - Buscar por ID
- `POST /api/comentarios` - Criar comentário
- `DELETE /api/comentarios/{id}` - Excluir comentário

---

### 📅 EventoService

Gerencia eventos associados a postagens.

```javascript
import { listEventos, getEventoById, createEvento, updateEvento, deleteEvento } from '../service/eventoService';

// Listar todos os eventos
const eventos = await listEventos();

// Buscar evento por ID
const evento = await getEventoById(1);

// Criar evento (requer uma postagem existente)
const novoEvento = await createEvento({
    titulo: 'Hackathon Fatec 2025',
    dataEvento: '2025-11-15T08:00:00',
    local: 'Campus Fatec São Paulo',
    criador: { id: 1 },
    postagem: { id: 2 }
});

// Atualizar evento
const atualizado = await updateEvento(1, {
    local: 'Novo local'
});

// Excluir evento
await deleteEvento(1);
```

**Endpoints:**
- `GET /api/eventos` - Listar eventos
- `GET /api/eventos/{id}` - Buscar por ID
- `POST /api/eventos` - Criar evento
- `PUT /api/eventos/{id}` - Atualizar evento
- `DELETE /api/eventos/{id}` - Excluir evento

⚠️ **Importante:** Todo evento DEVE ter uma postagem associada.

---

### 🚨 DenunciaService

Gerencia denúncias de conteúdo impróprio.

```javascript
import { listDenuncias, getDenunciaById, createDenuncia, deleteDenuncia } from '../service/denunciaService';

// Listar todas as denúncias
const denuncias = await listDenuncias();

// Buscar denúncia por ID
const denuncia = await getDenunciaById(1);

// Criar denúncia
const novaDenuncia = await createDenuncia({
    motivo: 'Conteúdo inapropriado',
    descricao: 'Detalhes da denúncia',
    denunciante: { id: 1 },
    postagem: { id: 5 }
});

// Excluir denúncia
await deleteDenuncia(1);
```

**Endpoints:**
- `GET /api/denuncias` - Listar denúncias
- `GET /api/denuncias/{id}` - Buscar por ID
- `POST /api/denuncias` - Criar denúncia
- `DELETE /api/denuncias/{id}` - Excluir denúncia

---

### 🏫 InstituicaoService

Gerencia instituições de ensino.

```javascript
import { listInstituicoes, getInstituicaoById, createInstituicao, updateInstituicao, deleteInstituicao } from '../service/instituicaoService';

// Listar todas as instituições
const instituicoes = await listInstituicoes();

// Buscar instituição por ID
const instituicao = await getInstituicaoById(1);

// Criar instituição
const novaInstituicao = await createInstituicao({
    nome: 'FATEC São Paulo',
    sigla: 'FATEC-SP',
    endereco: 'Av. Paulista, 1000'
});

// Atualizar instituição
const atualizada = await updateInstituicao(1, {
    endereco: 'Novo endereço'
});

// Excluir instituição
await deleteInstituicao(1);
```

**Endpoints:**
- `GET /api/instituicoes` - Listar instituições
- `GET /api/instituicoes/{id}` - Buscar por ID
- `POST /api/instituicoes` - Criar instituição
- `PUT /api/instituicoes/{id}` - Atualizar instituição
- `DELETE /api/instituicoes/{id}` - Excluir instituição

---

## 🛡️ Tratamento de Erros

Todos os services utilizam try-catch para tratamento de erros:

```javascript
import { listPostagens } from '../service/postagemService';

const carregarPostagens = async () => {
    try {
        const postagens = await listPostagens();
        console.log('Postagens:', postagens);
    } catch (error) {
        if (error.response) {
            // Erro da API
            console.error('Erro da API:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.request) {
            // Sem resposta do servidor
            console.error('Sem resposta do servidor');
        } else {
            // Erro na configuração da requisição
            console.error('Erro:', error.message);
        }
    }
};
```

## 🔧 Configuração da API

Os services dependem da configuração do `meetsApi` em `libs/api.js`:

```javascript
import axios from 'axios';

export const meetsApi = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar token JWT
meetsApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
```

## 📋 Checklist de Integração

- [ ] Backend rodando em `http://localhost:8080`
- [ ] Arquivo `libs/api.js` configurado corretamente
- [ ] Services importados corretamente
- [ ] Token JWT sendo salvo após login
- [ ] Interceptor adicionando token nas requisições
- [ ] Tratamento de erros implementado

## 🧪 Exemplo de Uso Completo

```javascript
import React, { useState, useEffect } from 'react';
import { 
    login, 
    saveToken, 
    listPostagens, 
    createComentario 
} from '../service';

const ExemploCompleto = () => {
    const [postagens, setPostagens] = useState([]);

    // Login ao montar componente
    useEffect(() => {
        const fazerLogin = async () => {
            try {
                const response = await login('joao.silva@fatec.sp.gov.br', 'password');
                saveToken(response.token);
                carregarPostagens();
            } catch (error) {
                console.error('Erro no login:', error);
            }
        };
        fazerLogin();
    }, []);

    // Carregar postagens
    const carregarPostagens = async () => {
        try {
            const dados = await listPostagens();
            setPostagens(dados);
        } catch (error) {
            console.error('Erro ao carregar postagens:', error);
        }
    };

    // Adicionar comentário
    const adicionarComentario = async (postagemId, conteudo) => {
        try {
            await createComentario({
                conteudo,
                postagem: { id: postagemId },
                usuario: { id: 1 }
            });
            carregarPostagens(); // Recarregar
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
        }
    };

    return (
        <div>
            {postagens.map(post => (
                <div key={post.id}>
                    <h3>{post.titulo}</h3>
                    <p>{post.conteudo}</p>
                </div>
            ))}
        </div>
    );
};

export default ExemploCompleto;
```

## 🔗 Links Úteis

- [Documentação Axios](https://axios-http.com/docs/intro)
- [React Native Networking](https://reactnative.dev/docs/network)
- [JWT Authentication](https://jwt.io/)

---

**Criado em:** 08/11/2025  
**Atualizado:** 08/11/2025
