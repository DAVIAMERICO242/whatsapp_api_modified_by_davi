A API original possui um token de consumo dos endpoints global como uma variável ambiente.

Eu modifiquei essa API do whatsapp (documentação em localhost:3000/api-docs (instalado por node)) para que apenas usuários autenticados acessem a documentação
, além disso apenas usuários com um token cadastrado pelo admin (eu) conseguem consumir os endpoints. Para isso criei middlewares e rotas para o login admin e para o consumo da API.

USUÁRIO ADMIN

localhost:3000
login: admin
senha: 896321574

USUÁRIO NORMAL

localhost:3000
login
senha
,onde o login e senha são cadastrados no painel admin
