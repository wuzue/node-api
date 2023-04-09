# **Teste Dev. Node - Fábrica de Startup**
### O objetivo deste teste é montar uma API para gerenciar um cardápio online.
<hr>

## **O projeto foi realizado utilizando as seguintes tecnologias:** 

<br>

* **TypeScript**<br>
Linguagem de programação que adiciona tipagem estática ao JavaScript, oferecendo mais segurança e facilidade de manutenção em projetos grandes e complexos.
Ao adicionar tipagem estática ao JavaScript, permite que o desenvolvedor tenha uma maior segurança ao escrever o código, pois é possível identificar erros de digitação de variáveis, funções e parâmetros antes mesmo de executar o código
* **jsonwebtoken**<br>
Biblioteca para criação e verificação de tokens de autenticação baseados em JSON.
Oferece uma forma segura e eficiente de gerenciar autenticação e autorização em aplicações web e APIs RESTful.
* **MongoDB**<br>
Banco de dados NoSQL baseado em documentos, com alta escalabilidade e flexibilidade de schema.
Permite armazenar e consultar grandes volumes de dados de forma rápida e eficiente, além de ser fácil de usar e escalar horizontalmente.
* **cors**<br>
Middleware para Express que adiciona cabeçalhos de resposta necessários para permitir que um cliente faça requisições a partir de um domínio diferente do que originou a requisição.
Evita erros de CORS (Cross-Origin Resource Sharing) em aplicações web que consomem APIs de outros domínios.
* **express**<br>
Framework de aplicação web para Node.js, com foco em simplicidade e flexibilidade.
Permite construir APIs e aplicações web de forma rápida e eficiente, oferecendo uma grande variedade de recursos e plugins disponíveis na comunidade.
* **dotenv**<br>
Biblioteca para carregar variáveis de ambiente a partir de um arquivo .env.
Facilita a configuração e o gerenciamento de variáveis de ambiente em aplicações Node.js, tornando o código mais limpo e portátil.

<hr>

## **Demonstração do projeto rodando:**
Vídeo demonstrativo do projeto em execução: https://www.youtube.com/watch?v=OwLHBgvY9gs
<hr>

## **Como rodar o projeto localmente?**
Clone o repositório para sua máquina:
```
git clone https://github.com/wuzue/node-api
```
Navegue até o diretório do projeto:
```
cd node-api
```
Instale as dependências do projeto:
```
npm i
```
Crie um arquivo ```.env``` na raíz do projeto com a seguinte variável:
```
DB_URI = ""
```
Enviei a string connection pelo e-mail junto com o link do teste, para evitar de deixar público aqui. Lembrando que o link não é o de admin, foi criado um usuário com permissões de escrita e leitura na coleção dos ```products```. Onde os produtos são deletados, adicionados, editados, etc.
<br>

Com a string de conexão correta, o arquivo ```.env``` deverá ficar assim:
```
DB_URI = "mongodb+srv://<USUÁRIO>:<SENHA>@clusterzero.ygwtxel.mongodb.net/menu"
```
E agora para inicar o projeto, é só rodar o comando:
```
npm run fast
```
Que vai *buildar* todo o código em TypeScript, iniciar o projeto e conectar ao banco de dados.<br>
Por padrão, a porta utilizada é a ```4000```.<br>
Então se ao iniciar o projeto teve alguma mensagem como:
```
Listening on port 4000
Connected to MongoDB
```
a API já está funcionando normalmente, e você pode accessá-lá em ```http://localhost:4000```.<br>
Agora, para ver o projeto funcionando, ou para se guiar no que você pode fazer, é só seguir o meu vídeo demonstrativo: https://www.youtube.com/watch?v=OwLHBgvY9gs

<hr>

#### *Observações*: Caso se depare com alguma mensagem indicando erro sintaxe ou este erro em específico ao rodar o projeto:
```
node_modules/mongodb_lib/operations/add_user.js:16 
this.options = options ?? {};
syntax error: unexpected token '?'
```
Provavelmente a sua versão do Node está desatualizada. Atualize para uma versão mais atual e rode o projeto novamente. Recomendo a versão 18+.