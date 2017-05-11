var express = require('express'),
    app = express();

var fs = require('fs');

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
var db = {
};

var dbPorJogador = {
};


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
app.set('view engine', 'hbs');


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json
app.set('views', 'server/views');

fs.readFile(__dirname + '/data/jogadores.json', function callback(err, data){
	if (err !== true){
    db = JSON.parse(data);
  }
	else
		console.log('Erro - '+ err);
});

fs.readFile(__dirname + '/data/jogosPorJogador.json', function callback(err, data){
	if (err !== true){
    dbPorJogador = JSON.parse(data);
  }
	else
		console.log('Erro - '+ err);
});

// GET /
app.get('/', function(request, response) {
  response.render('index', db);
});

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código
// GET /
app.get('/jogador/:numero_identificador/', function(request, response) {
  // Declara variáveis
  let jogadorDB = {};
  let listaJogosOrdenados = [];
  let listaTop5Jogos = [];
  let i = 0;
  let totalNaoJogados = 0;
  // Seleciona os detalhes do jogador
  listaJogosOrdenados = dbPorJogador[request.params.numero_identificador].games;  
  // Seleciona as informações do jogador
  for (i = 0; i < db.players.length; i++) {  
    if (db.players[i].steamid === request.params.numero_identificador){
      jogadorDB = db.players[i];
      break;
    }
  }
  listaJogosOrdenados = dbPorJogador[request.params.numero_identificador].games;
  // Conta o número de jogos que nunca foram jogados
  listaJogosOrdenados.forEach(function(element){
    if (element.playtime_forever === 0)
      totalNaoJogados++;
  });
  // Ordena a lista de jogos pelos jogos mais jogados
  listaJogosOrdenados.sort(function(a,b) {
    if (a.playtime_forever > b.playtime_forever)
      return -1;
    else
      return 1;
  });
  // Limpa a variável de controle
  i = 0;
  // Seleciona os 5 jogos mais jogados
  while ((i < listaJogosOrdenados.length) && (i !== 5)){
    listaJogosOrdenados[i].playtime_forever = Math.floor((listaJogosOrdenados[i].playtime_forever / 60),0);
    listaTop5Jogos.push(listaJogosOrdenados[i]);
    i = i + 1;
  }
  // Passa as informações necessárias para a view jogador
  response.render('jogador', {
      jogador: jogadorDB,
      jogos: listaTop5Jogos,
      totalJogos: listaJogosOrdenados.length,
      totalNaoJogados: totalNaoJogados
  });

});


// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static(__dirname + '/../client'));

// abrir servidor na porta 3000
// dica: 1-3 linhas de código
let server = app.listen(3000, function () {
  console.log('Escutando em: http://localhost:3000');
});
