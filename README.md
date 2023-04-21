# RabbitAllog
Projeto para envio e leitura de cartas eletrônicas | TypeScript

# Requisitos
<b>Requisitos Funcionais:</b> <br>
1. A API deve ter uma rota que aceite requisições POST para receber cartas eletrônicas em formato de objeto; <br>
2. O objeto de entrada deve conter os seguintes campos: FROM (O endereço de e-mail do remetente da carta eletrônica), TO (endereços de e-mail dos destinatários da carta eletrônica, separados por vírgula)
MESSAGE: O conteúdo da mensagem da carta eletrônica. <br>
3. O sistema deve ler e esperar as informações de remetente e destinatário vindos do corpo da requisição. <br>

<b>Requisitos Não Funcionais:</b> <br>
1. A linguagem do sistema deverá ser de fácil compreensão; <br>
2. O sistema deve fazer uso do RabbitMQ para enfileirar as mensagens. <br>

<b>Regras de Negócio:</b> <br>
1. O cadastro não poderá ser enviada caso o remetente ou destinatário estejam nulos; <br>
2. O usuário não poderá acessar uma rota inválida. <br>

# Modelo de implementação
<b>Services:</b> <br>
1. Api 
	- Enumns: utilizado principalmente no status das respostas das requisições;  <br>
	- Messages: armazena todas as mensagens disponíveis no sistema; <br>
	- RabbitConnection: faz a conexão entre a API e o serviço 'Producer', a fim de enviar as cartas eletrônicas; <br>
	- Routes: contém a rota POST disponível. <br>

2. MessageBroker
	- Producer : faz as validações dos campos esperados pela requisição e depois utiliza do redisInsertUser para cadastrar o usuário; <br>
	- userDelete: faz uso do redisGetUser para verificar se o usuário existe no banco de dados. Se sim, então redisDeleteUser é chamado; <br>

# Detalhamento do sistema 
<h2><b>Cadastrar usuário </b> <br> </h2>

Pré-condições:
1. Ter realizado corretamente as configurações de ambiente; 
2. Possuir internet.

Fluxo básico:
1. O usuário acessa o Insomnia ou Postman para testes; 
2. O usuário acessa a rota definida para o cadastro;
3. O usuário digita o nome e a idade;
4. O usuário clica em send;
5. O sistema retorna a mensagem SUC003;
6. O sistema retorna o id do usuário cadastrado.

Fluxo de exceção: 
		
(E1) Exceção ao passo 3 - Campos vazios;
1. O usuário não digita todos os campos necessários para o cadastro;
2. O sistema retorna a mensagem EXC003.

-------------------------------------

<h2><b>Editar usuário </b> <br> </h2>

Pré-condições:
1. Ter realizado corretamente as configurações de ambiente; 
2. Possuir internet;
3. Ter um usuário cadastrado no sistema;
4. Possuir o id o usuário que se deseja editar.

Fluxo básico:
1. O usuário acessa o Insomnia ou Postman para testes; 
2. O usuário acessa a rota definida para a edição;
3. O usuário digita o id e as novas informações de nome e/ou idade;
4. O usuário clica em send;
5. O sistema retorna a mensagem SUC005;
6. O sistema retorna como ficou os dados do usuário no sistema.

Fluxo de exceção: 
		
(E1) Exceção ao passo 3 - Campos vazios;
1. O usuário não digita todos os campos necessários para a edição;
2. O sistema retorna a mensagem EXC001.

(E2) Exceção ao passo 3 - Usuário inexistente;
1. O usuário digita as informações necessárias, mas elas não são válidas;
2. O sistema retorna a mensagem EXC005.

-------------------------------------

<h2><b>Deletar usuário </b> <br> </h2>

Pré-condições:
1. Ter realizado corretamente as configurações de ambiente; 
2. Possuir internet;
3. Ter um usuário cadastrado no sistema;
4. Possuir o id o usuário que se deseja deletar.

Fluxo básico:
1. O usuário acessa o Insomnia ou Postman para testes; 
2. O usuário acessa a rota definida para a exclusão;
3. O usuário digita no parâmetro da rota o id;
4. O usuário clica em send;
5. O sistema retorna a mensagem SUC004.

Fluxo de exceção: 
		
(E1) Exceção ao passo 3 - Parâmetro vazio;
1. O usuário não digita o id necessário para o funcionamento da exclusão;
2. O sistema retorna a exception EXC001.

(E2) Exceção ao passo 3 - Usuário inexistente;
1. O usuário digita a informação necessária, mas ela não é válida;
2. O sistema retorna a exception EXC005.

-------------------------------------

<h2><b>Consulta de usuário específico </b> <br> </h2>

Pré-condições:
1. Ter realizado corretamente as configurações de ambiente; 
2. Possuir internet;
3. Ter um usuário cadastrado no sistema;
4. Possuir o id o usuário que se deseja consultar.

Fluxo básico:
1. O usuário acessa o Insomnia ou Postman para testes; 
2. O usuário acessa a rota definida para a consulta;
3. O usuário digita no parâmetro da rota o id;
4. O usuário clica em send;
5. O sistema retorna as informações do usuário.

Fluxo de exceção: 
		
(E1) Exceção ao passo 3 - Parâmetro vazio;
1. O usuário não digita o id necessário para o funcionamento da consulta;
2. O sistema retorna a exception EXC003.

(E2) Exceção ao passo 3 - Usuário inexistente;
1. O usuário digita a informação necessária, mas ela não é válida;
2. O sistema retorna a exception EXC005.

-------------------------------------

# Configuração de ambiente 
1. Possuir o Docker instalado;
2. Possuir o Insomnia ou PostMan instalado;
3. Para rodar o programa utilizar os comandos abaixo e depois esperar as mensagens SUC001 e SUC002

	   npm install
	
	   docker-compose up 
	
	   npm run start

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
EAPI.errorFromSystemException() 
return { msg: 'Algo de errado aconteceu, tente novamente ou entre em contato com o fornecedor da aplicação!' };
```
(EXC003)
 ```js 
EUS.emptyFieldException() 
return { msg: 'É necessário que sejam enviados os campos de nome e idade sejam enviados!' };
```
(EXC004)
 ```js 
EUS.gettingIdException()
return { msg: 'É necessário enviar um id válido no parâmetro da rota!' };
```
(EXC005)
 ```js 
EUS.invalidUserException() 
return { msg: 'Não é possível gerenciar usuários que não estejam cadastrados!' };
```
 ---------------------------
 
<b>Success</b> <br>

(SUC001)
 ```js 
console.log('Aplicação rodando!');
```
(SUC002)
 ```js 
console.log('Conectado ao Redis!');
```
(SUC003)
 ```js 
 { msg: 'Usuário inserido com sucesso!', id: `${userId}` }
```
(SUC004)
 ```js 
 { msg: 'Usuário removido com sucesso!' }
```
(SUC005)
 ```js 
 { msg: 'Usuário editado com sucesso!', user: `${userName}, ${userAge}` }
```

# Estrutura de dados

Abaixo estão listados os dados esperados em cada rota:

/api/people/insert
       
    name: string
		
	age: number
	
	
	
/api/people/update
       
    id: string
		
    name: string
		
	age: number
		
	
/api/people/getById/:id	
		
	id: string
	
		
/api/people/delete/:id
       
    id: string
