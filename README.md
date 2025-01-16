# [mini ecommerce de compra e venda]() &middot; [![Autor Kaio](https://img.shields.io/badge/Autor-Kaio-%3C%3E)](https://kaioyuri.vercel.app)

Mini ecommerce de compra e venda projetado com [Next.js](https://nextjs.org/), [MUI Library](https://mui.com) e [Nest.js](https://nestjs.com) completo .
Feito para um processo seletivo.

## Arquitetura
O projeto foi feito com base na seguinte arquitetura abaixo:

#### No backend:

Foi criado os módulos
- `Purchases`: Estão as regras de negócio, rotas, services, controllers e dto's para 'Compras'. Conta também com Categorias que podem ser
adicionadas em 'categories' e dados extras como Status de compra e data de pagamento.
- `Sales`: Estão as regras de negócio, rotas, services, controllers e dto's para 'Vendas'. Nele está a lógica de adicionar vendas baseado em produtos, preços e categorias, podendo adicionar mais de 1 produto.
- `Products`: Estão as regras de negócio, rotas, services, controllers e dto's para 'Produtos'. É possível cadastrar produtos em suas respectivas categorias.

#### No frontend:
- Foram utilizados componentes e elementos UI do `MUI` junto com o `Nextjs` para deixar a aplicação dinamica e moderna, além de ter `tipagem` dos dados e componentes dinâmicos para a comunicação com o backend.


#### No Banco de dados:
- Criado as tabelas baseado no TypeORM com Banco de dados postgreSQL que estará rodando no `docker-compose`.

## Techs/frameworks usados no backend

- **Node.js**
- **Nest.js**
- **TypeScript**
- **TypeORM**
- **PostgreSQL**

## Techs/frameworks usados no frontend

- **Next.js 14**
- **TypeScript**
- **MUI**

## Instalação

### Requisitos

Esta aplicação utiliza `docker` para sua execução, então se você estiver no windows, é necessário baixar e instalar o [WSL](https://learn.microsoft.com/pt-br/windows/wsl/install) primeiro e **em seguida**
o [docker desktop](https://www.docker.com/products/docker-desktop/). Para usuários do linux basta apenas ter o `docker` e `docker-compose`.
É necessário também ter o Nodejs.

### Executando o projeto

No diretório a sua escolha você irá:

1. Clonar o repositório
   ```bash
   git clone https://github.com/KaioYuri/ecommerce.git
   ```

2. Abrir o repositório local
   ```bash
   cd ./ecommerce/
   ```
3. Executar o docker-compose
   ```bash
    docker-compose up --build
   ```
4. Instalar os pacotes do backend
    ```bash
    cd backend/
    npm install
    ```
5. Rodar o backend
    ```bash
    npm run start
    ```

4. Va para a URL `http://localhost:3000/` onde estará o frontend. Já o backend estará sendo 
executado em `http://localhost:3001/`. Caso deseje testar a API recomendo utilizar Postman ou Thunder Client.

### Rotas da API

1. Vendas:
- `{/sales}`
- `{/sales, POST}`
- `{/sales, GET}`
- `{/sales/:id, GET}`
- `{/sales/:id, PATCH}`
- `{/sales/:id, DELETE}`

2. Compras:
- `{/purchases}`
- `{/purchases, POST}`
- `{/purchases/sale/:saleId, GET}`
- `{/purchases/:id, GET}`
- `{/purchases, GET}`
- `{/purchases/:id/status, PATCH}`
- `{/sales-purchases, GET}`

3. Produtos:
- `{/products}`
- `{/products, POST}`
- `{/products, GET}`
- `{/products/:id, GET}`
- `{/products/:id, PATCH}`
- `{/products/:id, DELETE}`
- `{/products/categories, POST}`
- `{/products/categories, GET}`
- `{/products/categories/:id, GET}`
- `{/products/categories/:id, PATCH}`
- `{/products/categories/:id, DELETE}`
- `{/categories}`
- `{/categories, GET}`




