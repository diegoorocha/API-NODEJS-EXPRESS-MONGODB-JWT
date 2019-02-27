#RESUMO SOBRE A UTILIZAÇÃO DA API:
- API foi criada para gerenciar os equipamentos(notebook, desktop, monitor) de uma empresa;

#FUNÇÕES DA API:
- Registrar novo usuário administrador do sistema (responsavel pelo imput de informações no sistema);
![criar](https://user-images.githubusercontent.com/46031435/53509484-9f177500-3a9a-11e9-81f6-a5c0bddc185c.JPG)

- Autenticação do usuário administrador do sistema;
- Reset de senha (informar o token recebido no email);
- Esqueci minha senha (será enviado email com um token com expiração de 1 hora para alterar a senha);
(ABAIXO SOMENTE AUTENTICADO)!
- Registrar novos equipamentos e seus respectivos usuários(Insere informações dos equipamentos e usuário que utiliza o equipamento); 
- Consulta todos equipamentos registrados;
- Consultar equipamentos pelo ID;
- Consultar equipamentos pelo fabricante; (Necessário informar o fabricante);
- Consultar tipo(notebook, desktop, monitor) de equipamentos e suas quantidades;
- Consultar tipo(notebook, desktop, monitor) de equipamentos, por fabricante e suas quantidades;
- Consultar por setor a quantidade de cada tipo de equipamento e o fabricante;
- Consultar o usuário(id) responsavel pela utilização do equipamento;
- Consultar o administrador(id) responsavel pela criação das informações;
- Atualizar equipamentos e seus usuários;
- Deletar equipamentos e seus usuários;


#RESUMO SOBRE CRIAÇÃO DA API:
###API criada em NODEJS, utilizando suas dependências:
- Express;
- Mongoose;
- JWT;
- Nodemailer;
- Handlebars (Template engine para layout/view do e-mail);
- Utilização do mailtrap (caixa de e-mail fake) para recebimento de e-mails da API;

#API utiliza banco de dados NOSQL(mongodb):
- Utiliza banco de dados online (MLAB);
- Criação de models;
- Relacionamento entre as coleções;
- Consultas agregadas utilizando ($MATCH , $GROUP);

#INSTALAR:

1 - Obtenha o código fonte:

$ git clone https://github.com/diegoorocha/API-NODEJS-EXPRESS-MONGODB-JWT.git

2 - Mude para o seu diretório:

$ cd API-NODEJS-EXPRESS-MONGODB-JWT

3 - Execute o comando YARN INSTALL, ele irá instalar todas as dependências:

$ yarn install

4 - Execute o comando YARN START, ele irá executar o projeto:

$ yarn start

