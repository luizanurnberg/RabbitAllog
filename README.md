# RabbitAllog
Projeto para envio e leitura de cartas eletrônicas | TypeScript

# Requisitos
<b>Requisitos Funcionais:</b> <br>
1. A API deve ter uma rota que aceite requisições POST para receber cartas eletrônicas em formato de objeto; <br>
2. O objeto de entrada deve conter os seguintes campos: FROM (endereço de e-mail do remetente da carta eletrônica), TO (endereços de e-mail dos destinatários da carta eletrônica, separados por vírgula) e MESSAGE (conteúdo da mensagem da carta eletrônica); <br>
3. A API deve validar se os campos obrigatórios estão presentes no objeto de entrada; <br>
4. O serviço deve ser responsável por ler os itens da fila de forma sequencial e processá-los na ordem em que foram recebidos; <br>
5. O serviço deve estar em constante execução, consumindo a fila do RabbitMQ em intervalos regulares para verificar a presença de novas cartas eletrônicas; <br>
6. O serviço deve imprimir as cartas eletrônicas no terminal em que está sendo executado; <br>
7. A impressão deve seguir um formato adequado, exibindo o remetente, destinatários e mensagem da carta eletrônica de forma clara e legível. <br>

<b>Requisitos Não Funcionais:</b> <br>
1. A linguagem do sistema deverá ser de fácil compreensão; <br>
2. O sistema deve fazer uso do RabbitMQ para enfileirar as mensagens. <br>

<b>Regras de Negócio:</b> <br>
1. O cadastro não poderá ser enviada caso o remetente ou destinatário estejam nulos; <br>
2. O usuário não poderá acessar uma rota inválida; <br>
3. A API deve retornar uma resposta adequada indicando o sucesso ou falha do envio da carta eletrônica; <br>
4. O usuário poderá enviar uma carta eletrônica com a mensagem vazia, caso desejar. <br>

# Modelo de implementação
<b>Api:</b> <br>
1. Enumns: utilizado principalmente no status das respostas das requisições;  <br>
2. Messages: armazena todas as mensagens disponíveis no sistema; <br>
3. RabbitConnection: faz a conexão entre a API e o serviço 'Producer', a fim de enviar as cartas eletrônicas; <br>
4. Routes: contém a rota POST disponível. <br>

<b>Services:</b> <br>
1. MessageBroker
	- Producer: responsável por publicar os itens na fila de forma sequencial de acordo com a ordem que foram recebidos; <br>
	- Consumer: deve consumir e imprimir as cartas eletrônicas no terminal em que está sendo executado. <br>

# Detalhamento do sistema 
<h2><b>Enviar carta eletrônica </b> <br> </h2>

Pré-condições:
1. Ter realizado corretamente as configurações de ambiente; 
2. Possuir internet.

Fluxo básico:
1. O usuário acessa o Insomnia ou Postman para testes; 
2. O usuário acessa a rota definida para o envio;
3. O usuário digita o remetente e o destinatário;
4. O usuário clica em send;
5. O sistema retorna a mensagem SUC003;
6. O sistema envia a carta eletrônica para uma fila do rabbit.

Fluxo de exceção: 
		
(E1) Exceção ao passo 3 - Campos vazios;
1. O usuário não digita todos os campos necessários para o envio;
2. O sistema retorna a mensagem EXC003.

-------------------------------------

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
3. Para rodar o programa utilizar os comandos abaixo e depois esperar as mensagens SUC001 e SUC002

	   npm install
	   
	   docker pull rabbitmq:3-management
	   
	   docker run --rm -it -p 15672:15672 -p 5672:5672 rabbitmq:3-management


# Mensagens esperadas
<b>Exceptions</b> <br>

1. EAPI: erros provenientes do sistema e requisições;
2. EUS: erros causados pelo usuário.

(EXC001)
```js 
EAPI.invalidRouteException() 
return { msg: 'Você está tentando acessar uma rota inválida!' };
```
(EXC002)
 ```js 
EAPI.errorFromSystem() 
return { msg: 'Algo de errado aconteceu, tente novamente ou entre em contato com o fornecedor da aplicação!' };
```
(EXC003)
 ```js 
EUS.emptyFieldException() 
return { msg: 'É necessário que sejam enviados os campos de remetente e destinatário sejam enviados!' };
```
 ---------------------------
 
<b>Success</b> <br>

(SUC001)
 ```js 
console.log('Aplicação rodando!');
```
(SUC002)
 ```js 
console.log('Conectado ao Rabbit!');
```
(SUC003)
 ```js 
 { msg: 'A carta eletrônica foi enviada com sucesso!' };
```

# Estrutura de dados

Abaixo estão listados os dados esperados na rota disponível:

/sendletter
       
    from: string
		
	to: string
	
	message: string
	
	
