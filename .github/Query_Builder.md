# Query Builders

Um *Database Query Builder* é usado para construir instruções SQL (SELECT, UPDATE e DELETE), é um Construtor de Consulta.

O *query builder* permite que você construa uma instrução SQL independente de banco de dados.

## Instalando Knex.js

Knex.js é um  SQL query builder para PostgreSQL, CockroachDB, MSSQL, MySQL, MariaDB, SQLite3, Better-SQLite3, Oracle e Amazon Redshift projetado para ser flexível, portátil e fácil de usar.

Para instalar o Knex no nosso projeto usamos o comando:

```bash
npm install knex --save
```
## Configurando o Knex.js

Para iniciar a configuração do knex, usamos o comando

```bash
npx knex init
```

 que inicializa a configuração criando o arquivo `knexfile.js` na pasta raiz da aplicação.

Abrindo esse arquivo podemos limpar as configurações desnecessárias e deixar apenas a chave development dentro de module.exports

```javascript
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  }
};
```
Em **filename** devemos informar o caminho para o arquivo do banco de dados sqlite. Para evitar problemas com o caminho do arquivo no sistema operacional, usamos o lib **path**, fazemos s importação no topo do arquivo

```javascript
const path = require('path')
```
e no **filename** usamos o **path.resolve** para informar o caminho do arquivo.

```javascript
filename: path.resolve(__dirname, "src", "database", "database.db")
```
depois informamos a opção **useNullAsDefault** para eceitar valores nulos

```javascript
const path = require('path')

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
    },
    useNullAsDefault: true
  }
};
```
Com a configuração inicial pronta, criamos a estrutura do knex no projeto. Dentro da pasta **database** criamos outra pasta com o nome **knex** e dentro dela o arquivo **index.js**.

Dentro do arquivo **index** importamos o arquivo de configuração e também o próprio *knex*.

Depois estanciamos a conexão chamando a função **knex()** passando como argumento a configuração criada anteriormente.

```javascript
const config = require('../../../knexfile')
const knex = require('knex')

const connection = knex(config.development)

module.exports = connection
```

## Migrations com Knex

O caminho para as migrations no knex também são incluídas dentro do arquivo de configuração, na chave **migrations**.

Criamos a pasta **migrations** dentro da pasta **knex** e incluimos a configuração no **knexfile.js** usando o path.resolve.

```javascript
const path = require('path')

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations" )
    }
  }
};
```
------
> As migrations com o knex são gerenciadas por ele mesmo sendo a criação das tabelas feita por comando do knex, mantendo histórico das alterações (versionamento) das tabelas.
------

Para criar a tebela *NOTES* executamos o comando knex *migrate:make* seguido do nome da migration.

```bash
npx knex migrate:make createNotes
```
esse comando cria um arquivo dentro da pasta migration do knex, nele criamos a estrutura de criação da tabela:

### @Criando tabelas

```javascript
exports.up = knex => knex.schema.createTable("notes", table => {
  table.increments('id')
  table.text('title')
  table.text('description')
  table.integer('user_id').references('id').inTable('users')

  table.timestamp('created_at').default(knex.fn.now())
  table.timestamp('updated_at').default(knex.fn.now())

})

exports.down = knex => knex.schema.dropTable('notes')
```
------
> `exports.up` - estrutura para criação da tabela

> `exports.down` - estrutura para 'dropar' a tabela
------

depois de criar o script executamos a criação com o comando **migrate:latest**

```bash
npx knex migrate:latest
```
------
>  [Outros comandos **migration-cli**](https://knexjs.org/guide/migrations.html#migration-cli)
------
para facilitar a execução das migrations podemos incluir um script de execução no **package.json** no bloco de *scripts* com o comando "knex migrate:latest".

```json
"scripts": {
  "start": "node ./src/server.js",
  "dev": "nodemon ./src/server.js",
  "migrate": "knex migrate:latest"
},
```
e executar com

```bash
npm run migrate
```
### @Tipos de dados

Usamos **schema-building commands** para criar os campos da tabela.

Mais detalhes em [Knex Schema-builder](https://knexjs.org/guide/schema-builder.html#createtable).

```javascript
/* Knex schema-building commands */

/* PK - Primary Key - chave primaria */

// campo incremental, knex define automaticamente como Chave Primaria
table.increments() // PK incremental nomeado de id
//se não passado um nome, é usado 'id' por padrão

table.increments('user_id')  // PK - incremental nomeado 'user_id'


// campo de texto
table.text('title')

// campo de data
table.timestamp('created_at') // timestamp - data e hora
  .default(knex.fn.now())     // valor padrão função Now knex (data hora atual)

/* FK - Foreign Key - Chave Estrangeira */

table.integer('user_id')  // FK - valor Num inteiro
  .references('id')       // referencia ID
  .inTable('users')       // da tabela users

table.integer('note_id')  // FK - valor Num inteiro
  .references('id')       // referencia ID
  .inTable('notes')       // da tabela notes
  .onDelete("CASCADE")    // deleta em cascata caso o valor de referencia seja deletado


table.timestamps()
// cria automáticamente os campos 'created_at' e 'update_at'
// ambos como datetime não nulo e valor padrão data hora atual

```

### @Habilitar CASCADE no SQLite

Para habilitar a deleção em cascata no SQLite precisamos adicionar o **pool** na configuração. O pool é uma funcionalidade que é executada ao efetuar a conexão com o banco de dados:

`pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb)
    }`

Incluímos no pool a propriedade **afterCreate** que vai conter uma arrow function que executa no banco de dados o comando PRAGMA para ativar o CASCADE.


Ficando o arquivo `knexfile.js` desta forma:
```javascript
const path = require('path')

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db")
    },
    pool: {
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_key = ON", cb)
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    }
  }
};
```
## Cadastrando com Knex [**INSERT**]

Criamos nossa classe controller que vai usar o knex;

Para fazer o acesso ao BD pelo knex importamos a conexão knex que já temos configurada na pasta database;

No nosso método create recebemos request e response;

Desestruturamos os dados recebidos pelo corpo da req. json em request.body e id de usuário recebido por parametro de rota;

executamos um insert através de

`knex('notes').insert({
title,
description,
user_id})`

passando os dados que serão inseridos, essa função retorna o id da nota criada pelo insert;

em seguida mapeamos o links recebidos em um array com a estrutura da tabela links (id da nota acabamos de inserir no banco e a url do link) para cada um dos links;

passamos o array para o insert do knex que repete a inserção para cada valor do array

`knex('links').insert(linksInsert)`

mapeamos também os valores das tags (agora com id da nota, id do usuário e o nome da tag)

e executamos a inserção informando o array de tags

`knex('tags').insert(tagsInsert)`

com todos os valores cadastrados, retornamos a response com um json vazio que devolve o valor padrão 200 de status OK.


```javascript
const knex = require('../database/knex')

class NotesController {

  async create(request, response) {
    const { title, description, tags, links } = request.body
    const { user_id } = request.params

    const note_id = await knex('notes').insert({
      title,
      description,
      user_id
    })

    const linksInsert = links.map(link => {
      return {
        note_id,
        url: link
      }
    })

    await knex('links').insert(linksInsert)

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        user_id,
        name
      }
    })

    await knex('tags').insert(tagsInsert)

    response.json()
  }

}

module.exports = NotesController

```

## Consultando com Knex [**SELECT**]

Exemplo de consulta:

```javascript
  async show(request, response) {
    const { id } = request.params

    const note = await knex('notes').where({ id }).first()

    if (!note) return response.status(404).end()

    const tags = await knex('tags').where({ note_id: id }).orderBy('name')
    const links = await knex('links').where({ note_id: id }).orderBy('created_at')

    return response.json({ ...note, tags, links })

  }
```
Recebe o id da nota por parâmetro de requisição

`const { id } = request.params`

Executa o select buscando na tabela as notas com o id e é esperado apenas uma nota, então usamos **first()** para pegar o primeiro resultado disponível

`knex('notes').where({ id }).first()`

se nada for encontrado no BD encerra a requisição com codigo 404

`if (!note) return response.status(404).end()`

se tivermos uma nota, buscamos os links e tags relacionados a nota, ordenando tags por nome e links por data de criação

`const tags = await knex('tags').where({ note_id: id }).orderBy('name')`

`const links = await knex('links').where({ note_id: id }).orderBy('created_at')`

por fim retornamos um json agrupando todos os dados finalizando a requisição com código 200 por padrão

`response.json({ ...note, tags, links })`

------
### Consulta listando várias notas:

```javascript
  async index(request, response) {
    const { user_id } = request.query

    const notes = await knex('notes')
      .where({ user_id }).orderBy('created_at', 'desc')

    response.json({ notes })
  }

```
Recebe o id da nota por query de requisição

`const { id } = request.query`

Lista todas as notas do usuário com o id informado classificadas por data de criação em ordem decrescente (a mais nova primeiro).

`knex('notes').where({ user_id }).orderBy('created_at', 'desc')`

Para buscar com apenas parte de um texto usamos o operador LIKE do where

``knex('notes').select('*').where({ user_id }).whereLike("title", `%${title}%`).orderBy('title')``

assim o valor entre '%' (porcentagens) é retornado na busca desde que apareceça em qualquer parte do título.

### Consulta buscando vários valores

```javascript
async index(request, response) {
  const { user_id, title, tags } = request.query
  let notes

  const filterTags = tags.split(',').map(tag => tag.trim())

  notes = await knex('tags').whereIn('name', filterTags)
}
```
Nesse exemplo recebemos vários valores de **tag** pela *query* da rota

`http://localhost:3333/notes?user_id=1&title=script&tags=node,react`

Então usamos o split() e criamos um array com cada um dos valores separados por vírgula e limpamos os espaços desnecessários com trim()

`const filterTags = tags.split(',').map(tag => tag.trim())`

e buscamos na tabela tags pelos registros que contenham qualquer um dos valores do array filterTags no campo name

`knex('tags').whereIn('name', filterTags)`

## Deletando com Knex [**DELETE**]

```javascript
async delete(request, response) {
  const { id } = request.params

  const note = await knex('notes')
    .where({ id }).delete()

  if (!note) return response.status(404).json()

  return response.json()
}
```
Recebe o id da nota por parâmetro de requisição

`const { id } = request.params`

Executa o delete na tabela notas com o id informado, a função retorna 1 se o delete for executado com sucesso ou 0 caso o valor a ser deletado não for encontrado no BD.

`knex('notes').where({ id }).delete()`

se não for encontrado encerra a req com cod 404

`if (!note) return response.status(404).json()`

case contrário retorna 200, cod Ok padrão.


> Os links e tags relacionados a nota também são apagados, pois ativamos a função [**Cascade**](#habilitar-cascade-no-sqlite)
 no banco.
