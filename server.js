/* Alunos: Gustavo Palmeira Zaia, Haria Othon Gomes Silva, Vinicius Polachini Mayer Freitas de Jesus.
Trabalho de Redes 1 */

/* Importanto bibliotecas e iniciando o servidor */
const express = require(`express`);
const path = require(`path`);

const app = express();
const server = require(`http`).createServer(app);
const io = require(`socket.io`)(server); // servidor inciado e aguardando conexao da camada do usuario
/* --------------------------------------------- */

app.use(express.static(path.join(__dirname, `public`)));
app.set(`views`, path.join(__dirname, `public`));
app.engine(`html`, require(`ejs`).renderFile);
app.set(`view engine`, `html`); //usando o protocolo de http e tcp para a comunicacao

/* iniciando camada do usuario */
app.use(`/`, (req, res) => {
  res.render(`index.html`); // ao abrir a pagina ja acontece a conexao com o servidor
});
/* --------------------------- */

let messages = []; //criando um "banco de dados" para o armazenamento das mensangens enviadas em uma array

io.on(`connection`, (socket) => {
  // No momento em que o usuario conecta no servidor comeca o ligacao das camadas
  console.log(`Server Conectado pelo Socket: ${socket.id}`); //assim que conectados uma mensagem de aviso e feita no console do servidor

  socket.emit("previousMessage", messages); //Recuperacao das antigas mensagens que estao armazenadas no "banco de dados"

  /* Servidor aguardando o recebimento das informacoes do front end e camada do usucario */
  socket.on("sendMessage", (data) => {
    //no evento de sendMessage pela camada do usuario, o servidor recebe as informacoes passadas pela funcao
    messages.push(data); //o servidor insere as informacoes recuperadas do front para dentro do array de mensagens
    console.log(data); //passa a informacao recebida para o terminal do servidor
    socket.broadcast.emit("receivedMessage", data); // retorna o evento para uma nova funcao da camada de usuario
  });
});

server.listen(3000); //definindo a porta de rede do servidor
