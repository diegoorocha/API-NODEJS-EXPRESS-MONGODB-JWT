# RESUMO SOBRE A UTILIZAÇÃO DA API:
- API(EXEMPLO) foi criada para gerenciar os equipamentos(notebook, desktop, monitor) de uma empresa;
- A criação desta API, é para fins de estudos!

# RESUMO SOBRE CRIAÇÃO DA API:
#### API criada em NODEJS, utilizando suas dependências:
- Express;
- Mongoose;
- JWT;
- Nodemailer;
- Handlebars (Template engine para layout/view do e-mail);
- Utilização do mailtrap (caixa de e-mail fake) para recebimento de e-mails da API;

#### API utiliza banco de dados NOSQL(mongodb):
- Utiliza banco de dados online (MLAB);
- Criação de models;
- Relacionamento entre as coleções;
- Consultas agregadas utilizando ($MATCH , $GROUP);

#### INSTALAR:

1 - Obtenha o código fonte:

$ git clone https://github.com/diegoorocha/API-NODEJS-EXPRESS-MONGODB-JWT.git

2 - Mude para o seu diretório:

$ cd API-NODEJS-EXPRESS-MONGODB-JWT

3 - Execute o comando YARN INSTALL, ele irá instalar todas as dependências:

$ yarn install

4 - Execute o comando YARN START, ele irá executar o projeto:

$ yarn start



# FUNÇÕES DA API:
- Registrar novo usuário administrador do sistema (responsavel pelo imput de informações no sistema);
![criar](https://user-images.githubusercontent.com/46031435/53509484-9f177500-3a9a-11e9-81f6-a5c0bddc185c.JPG)

POST: http://localhost:4000/auth/register

- Autenticação do usuário administrador do sistema;
![autenticar](https://user-images.githubusercontent.com/46031435/53509630-e998f180-3a9a-11e9-9c7e-c86aecc86724.JPG)

POST: http://localhost:4000/auth/authenticate

- Reset de senha (informar o token recebido no email);
![reset_senha](https://user-images.githubusercontent.com/46031435/53509674-07665680-3a9b-11e9-9a48-7e01cff5a637.JPG)

POST: http://localhost:4000/auth/reset_password

- Esqueci minha senha (será enviado email com um token com expiração de 1 hora para alterar a senha);
![esqueci_senha](https://user-images.githubusercontent.com/46031435/53511327-f91a3980-3a9e-11e9-9624-2a47eb3fa1dd.JPG)

![email](https://user-images.githubusercontent.com/46031435/53511278-d4be5d00-3a9e-11e9-9c20-5e251303b7a6.JPG)

POST: http://localhost:4000/auth/forgot_password

(ABAIXO SOMENTE AUTENTICADO)!
- Registrar novos equipamentos e seus respectivos usuários(Insere informações dos equipamentos e usuário que utiliza o equipamento); 
![criar_novo_equipamento](https://user-images.githubusercontent.com/46031435/53510161-18639780-3a9c-11e9-9af7-d3a104470262.JPG)

POST: http://localhost:4000/computer

- Consulta todos equipamentos registrados;
![listar_todos_equipamentos](https://user-images.githubusercontent.com/46031435/53510190-25808680-3a9c-11e9-973b-166bd4c7ed4c.JPG)

GET: http://localhost:4000/computer

- Consultar equipamentos pelo ID;
![equipamento_id](https://user-images.githubusercontent.com/46031435/53510263-49dc6300-3a9c-11e9-9c51-4449085953be.JPG)

GET: http://localhost:4000/computer/computer_id/:id

- Consultar equipamentos pelo fabricante; (Necessário informar o fabricante);
![equipamento_fabricant](https://user-images.githubusercontent.com/46031435/53510339-88721d80-3a9c-11e9-89cf-511fa95217e2.JPG)

GET: http://localhost:4000/computer/fabricant

- Consultar tipo(notebook, desktop, monitor) de equipamentos e suas quantidades;
![equipamento_por_tipo](https://user-images.githubusercontent.com/46031435/53510433-b6576200-3a9c-11e9-9644-42ae387f339a.JPG)

GET: http://localhost:4000/computer/qtdEquipament

- Consultar tipo(notebook, desktop, monitor) de equipamentos, por fabricante e suas quantidades;
![total_tipo_fabricant](https://user-images.githubusercontent.com/46031435/53510480-dc7d0200-3a9c-11e9-9b5b-732b21632b4f.JPG)

GET: http://localhost:4000/computer/marcaVsFabricant

- Consultar por setor a quantidade de cada tipo de equipamento e o fabricante;
![total_tipo_fabricant_departamento](https://user-images.githubusercontent.com/46031435/53510558-0b937380-3a9d-11e9-9c1b-01e80ea4b6d7.JPG)

GET: http://localhost:4000/computer/qtdEquipamentDepartment

- Consultar o usuário(id) responsavel pela utilização do equipamento;
![usuario_dono_equipamento](https://user-images.githubusercontent.com/46031435/53510620-367dc780-3a9d-11e9-8f43-4d40743eaf8d.JPG)

GET: http://localhost:4000/computer/userEquipament/:id

- Consultar o administrador(id) responsavel pela criação das informações;
![adm_cadastro](https://user-images.githubusercontent.com/46031435/53510672-51503c00-3a9d-11e9-9c7b-5f402247e2b0.JPG)

GET: http://localhost:4000/computer/userAdmin/:id

- Consultar o total de equipamentos;
![total](https://user-images.githubusercontent.com/46031435/53511797-fc61f500-3a9f-11e9-8e58-2660256fc86c.JPG)

GET: http://localhost:4000/computer/totalEquipament

- Atualizar equipamentos e seus usuários;
![atualizar](https://user-images.githubusercontent.com/46031435/53510752-7fce1700-3a9d-11e9-9c41-c22762cb4ac3.JPG)

PUT: http://localhost:4000/computer/updateEquipament/:id

- Deletar equipamentos e seus usuários;
![deletar](https://user-images.githubusercontent.com/46031435/53510804-9d9b7c00-3a9d-11e9-9709-fbf0959d9243.JPG)

DEL: http://localhost:4000/computer/deleteEquipament/:id


-------
