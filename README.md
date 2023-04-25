# RabbitAllog

Projeto do estágio para envio e leitura de cartas eletrônicas | TypeScript

# Descrição fornecida pelo surpevisor

Desenvolver um projeto em NodeJS para envio e leitura de cartas eletrônicas. O projeto deve conter uma rota para enviar as cartas eletrônicas para uma fila do Rabbit, e também um SERVIÇO que lê a fila do Rabbit e imprime as cartas enviadas no terminal. Utilizar o Rabbit para fazer a interação entre a parte da API e do SERVIÇO. Detalhes da API: A rota deve receber como parâmetro um objeto, exemplo:'{ FROM: “joão”, TO: “maria", MESSAGE: “Olá Maria” }' e enviar as informações recebidas por rota para uma nova fila no Rabbit. Detalhes do SERVIÇO: Desenvolver um consumidor para essa nova fila do Rabbit e consumir itens da fila do Rabbit e imprimir no console onde está rodando o
terminal do Projeto.

# Requisitos levantados

<b>Requisitos Funcionais:</b> <br>

1. A API deve ter uma rota que aceite requisições POST para receber cartas eletrônicas em formato de objeto; <br>
2. O objeto de entrada deve conter os seguintes campos: FROM (endereço de e-mail do remetente da carta eletrônica), TO (endereços de e-mail dos destinatários da carta eletrônica, separados por vírgula) e MESSAGE (conteúdo da mensagem da carta eletrônica); <br>
3. A API deve validar se os campos obrigatórios estão presentes no objeto de entrada; <br>
4. O serviço deve ser responsável por ler os itens da fila de forma sequencial e processá-los na ordem em que foram recebidos; <br>
5. O serviço deve estar em constante execução, consumindo a fila do RabbitMQ em intervalos regulares para verificar a presença de novas cartas eletrônicas, mesmo quando essas forem enviadas por meio da interface de controle; <br>
6. O serviço deve imprimir as cartas eletrônicas no terminal em que está sendo executado; <br>
7. A impressão deve seguir um formato adequado, exibindo o remetente, destinatários e mensagem da carta eletrônica de forma clara. <br>

<b>Requisitos Não Funcionais:</b> <br>

1. A linguagem do sistema deverá ser de fácil compreensão; <br>
2. O sistema deve fazer uso do RabbitMQ para enfileirar as mensagens. <br>

<b>Regras de Negócio:</b> <br>

1. O cadastro não poderá ser enviada caso o remetente, destinatário ou mensagem estejam nulos; <br>
2. O usuário não poderá acessar uma rota inválida; <br>
3. A API deve retornar uma resposta adequada indicando o sucesso ou falha do envio da carta eletrônica; <br>

# Modelo de implementação

<b>Api:</b> <br>

1. Enumns: utilizado principalmente no status das respostas das requisições; <br>
2. Messages: armazena todas as mensagens disponíveis no sistema; <br>
3. Index: faz a conexão entre a API e o serviço 'Producer', a fim de enviar as cartas eletrônicas; <br>
4. Routes: contém a rota POST disponível. <br>

<b>Services:</b> <br>

1. MessageBroker
   - Producer: responsável por publicar os itens na fila de forma sequencial de acordo com a ordem que foram recebidos; <br>
   - Consumer: deve consumir e imprimir as cartas eletrônicas no terminal em que está sendo executado. <br>

<b>App:</b> <br>
   - Inicializa o servidor para consumir as cartas eletrônicas.

# Detalhamento do sistema

<h2><b>Enviar carta eletrônica </b> <br> </h2>

Pré-condições:

1. Ter realizado corretamente as configurações de ambiente;
2. Possuir internet.

Fluxo básico:

1. O usuário acessa o Insomnia ou Postman para testes;
2. O usuário acessa a rota definida para o envio;
3. O usuário digita o remetente, destinatário e a mensagem;
4. O usuário clica em send;
5. O sistema retorna a mensagem SUC003;
6. O sistema envia a carta eletrônica para uma fila do rabbit.

Fluxo de exceção:
(E1) Exceção ao passo 3 - Campos vazios;

1. O usuário não digita todos os campos necessários para o envio;
2. O sistema retorna a mensagem EXC004.

Fluxo de exceção:
(E2) Exceção ao passo 3 - Mensagem inválida

1. O usuário não digita uma mensagem para ser enviada ao destinatário;
2. O sistema retorna a mensagem EXC006.

Fluxo de exceção:
(E2) Exceção ao passo 2 - Rota inválida;

1. O usuário não acessa uma rota válida para o envio da mensagem;
2. O sistema retorna a mensagem EXC005.

---

<h2><b>Consumir conteúdo da carta eletrônica </b> <br> </h2>

Pré-condições:

1. Ter realizado corretamente as configurações de ambiente;
2. Possuir internet;
3. Ter enviado ao menos uma carta eletrônica.

Fluxo básico:

1. O usuário aguarda a mensagem aparecer no terminal do projeto, após ser processada pelo rabbit.

# Configuração de ambiente

1. Possuir o Docker instalado;
2. Possuir o Insomnia ou PostMan instalado;
3. Para rodar o programa utilizar os comandos abaixo e depois esperar as mensagens SUC001 e SUC002;

   npm install

   docker pull rabbitmq:3-management

   docker run --rm -it -p 15672:15672 -p 5672:5672 rabbitmq:3-management

4. Adicionar um arquivo .env se necessário, com as informações abaixo.

   RABBIT_URL = 'amqp://localhost'

   QUEUE_NAME = 'letters'

# Mensagens esperadas

<b>Exceptions</b> <br>

1. EAPI: erros provenientes do sistema e requisições;
2. EUS: erros causados pelo usuário.

(EXC001)

```js
EAPI.serverConnectionFalied();
return {
  msg: "Não foi possível realizar a conexão com o servidor, tente novamente!",
};
```

(EXC002)

```js
EAPI.errorFromSystem();
return {
  msg: "Algo de errado aconteceu, tente novamente ou entre em contato com o fornecedor da aplicação!",
};
```

(EXC003)

```js
EAPI.connectionNotAvaliable();
return {
  msg: "Não foi possível conectar com o Rabbit",
};
```

(EXC004)

```js
EUS.emptyField();
return {
  msg: "É necessário que sejam enviados os campos de remetente e destinatário sejam enviados!",
};
```

(EXC005)

```js
EUS.invalidRoute();
return {
  msg: "Você está tentando acessar uma rota inválida!",
};
```

(EXC006)

```js
EUS.emptyMessage();
return {
  msg: "Você está tentando enviar uma mensagem em branco, preencha o campo e tente novamente!",
};
```

---

<b>Success</b> <br>

(SUC001)

```js
console.log("Aplicação rodando!");
```

(SUC002)

```js
console.log("Conectado ao Rabbit!");
```

(SUC003)

```js
{
  msg: "A carta eletrônica foi enviada com sucesso!";
}
```

# Estrutura de dados

Abaixo estão listados os dados esperados na rota disponível:

/sendletter

    FROM: string

    TO: string

    MESSAGE: string
