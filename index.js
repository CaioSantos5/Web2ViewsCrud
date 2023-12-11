const express = require("express");
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views', './views');
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });


const PORT = 3000;

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HOME >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HOME >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HOME >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< HOME >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.get('/', (req, res) => {
  res.render('home.ejs');
 });

 app.get('/busca', (req, res) => {
  res.render('buscaProdutos.ejs');
 });

 app.get('/cadastro', (req, res) => {
  res.render('cadastraProduto.ejs');
 });

const { Op } = require("sequelize"); //parametro de busca
const Produto = require("./model/produto");

//Inserção de dados ... primeiro produto

/*var produto = Produto.create({
  codigo: 123,
  nome: "Bolsa",
  preco: 150,
  marca: "gucci",
})
  .then(function () {
    console.log("Produto inserido com sucesso!");
  })
  .catch(function (erro) {
    console.log("Erro ao inserir produto: " + erro);
  });*/

//Produto.sync() --> Esta linha foi comentada após rodar corretamente o serviço e criar a tabela sincronizada com o model,
// foi comentada para não gerar nova tabela após rodar novamente o serviço
//
/*app.get('/produtos', (req, res) => {

    var nomeFiltro = req.query.nomeFiltro;
    var precoMaximo = req.query.precoMaximo;

    var resultadodaBusca = [];
    produtos.forEach(produto => {
        if (produto.nome.includes(nomeFiltro) &&
            produto.preco <= precoMaximo) {
            resultadodaBusca.push(produto);
        }
    })
    res.send(resultadodaBusca);

    var todosProdutos = '';
    for (var i = 0; i < produtos.length; i++) {
        todosProdutos += "Código: " + produtos[i].codigo;
        todosProdutos += "Nome: " + produtos[i].nome;
        todosProdutos += "Preço: " + produtos[i].preco;
        todosProdutos += "<br>";

    }
    res.send(todosProdutos) 
});*/
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CADASTRAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CADASTRAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CADASTRAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CADASTRAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.post("/cadastraProdutos", urlencodedParser, (req, res) => {
  var codigoProduto = req.body.codigo;
  var nomeProduto = req.body.nome;
  var precoProduto = req.body.preco;
  var marcaProduto = req.body.marca;

  var produto = Produto.create({
    codigo: codigoProduto,
    nome: nomeProduto,
    preco: precoProduto,
    marca: marcaProduto,
  })
    .then(function () {
      res.send("Produto inserido com sucesso!" + produto); //console.log > res.send
    })
    .catch(function (erro) {
      res.send("Erro ao inserir produto: " + erro);
    });

  //res.send(todosProdutos);
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CONSULTAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CONSULTAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CONSULTAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< CONSULTAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.post("/produtos", urlencodedParser, (req, res) => {
  var nomeFiltro = req.body.nomeFiltro;
  var marcaFiltro = req.body.marcaFiltro;
  var precoMaximo = req.body.precoMaximo;
  var todosProdutos =
    "<table><tr><th>Id</th><th>Código</th><th>Nome</th><th>Preço</th><th>Marca</th><th>Alterar</th></tr>";
    marcaFiltro = "%" + marcaFiltro + "%";
    nomeFiltro = "%" + nomeFiltro + "%"; //transforma a variavel de texto exato para texto semelhante

  Produto.findAll({
    where: {
      nome: { [Op.like]: nomeFiltro }, //pega qualquer nome digitado como parametro de busca por nome
      marca: { [Op.like]: marcaFiltro },
      preco: { [Op.lte]: precoMaximo }, //defina o valor máximo que será buscado
    },
  })
    .then(function (produtos) {
      console.log(produtos);

      
      res.render('resultadoBusca',{produtos:produtos})
    })
    .catch(function (erro) {
      console.log("Erro na consulta: feio" + erro);
    });

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ALTERAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ALTERAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ALTERAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ALTERAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  //                     ############### PARTE 1 ###############
  app.get("/alteraProduto", (req, res) => {
    var idProduto = req.query.id;

    Produto.findOne({
      where: {
        id: idProduto,
      },
    })
      .then(function (produto) {
        console.log(produto);

        var formulario = "<form action='/updateProduto' method='post'>";
        formulario +=
          "<input type='hidden' name='id' value='" + produto.id + "'>";
        formulario +=
          "Código do Produto:<br> <input type='text' name='codigo' id='codigo' value='" +
          produto.codigo +
          "'><br>";
        formulario +=
          "Nome do Produto:<br> <input type='text' name='nome' id='nome' value='" +
          produto.nome +
          "'><br>";
        formulario +=
          "Preço:<br> <input type='text' name='preco' id='preco' value='" +
          produto.preco +
          "'><br>";
        formulario +=
          "Marca:<br> <input type='text' name='marca' id='marca' value='" +
          produto.marca +
          "'><br>";
        formulario += "<input type='submit' value='Salvar'><br>";
        formulario += "</form>";

        res.send("<b>Tela para alterar Produto</b><br>" + formulario);
      })
      .catch(function (erro) {
        console.log("Erro na consulta: feio" + erro);
      });
  });

  //                     ############### PARTE 2 ###############

  app.post("/updateProduto", urlencodedParser, (req, res) => {
    var idProduto = req.body.id;
    var codigoProduto = req.body.codigo;
    var nomeProduto = req.body.nome;
    var precoProduto = req.body.preco;
    var marcaProduto = req.body.marca;

    Produto.update(
      {
        codigo: codigoProduto,
        nome: nomeProduto,
        preco: precoProduto,
        marca: marcaProduto,
      },
      {
        where: {
          id: idProduto,
        },
      }
    )
      .then(function (produto) {
        res.send("<b>Produto alterado com sucesso!!</b>");
      })
      .catch(function (erro) {
        res.send("<b>Erro ao alterar produto!" + erro + "</b>");
      });
  });

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////

  /*
    app.post("/produtos", urlencodedParser, (req, res) => {
      var nomeFiltro = req.body.nomeFiltro;
      var precoMaximo = req.body.precoMaximo;
      var todosProdutos = "<table><tr><th>Id</th><th>Código</th><th>Nome</th><th></th></tr>";
      nomeFiltro = '%'+nomeFiltro+'%';//transforma a variavel de texto exato para texto semelhante
    
      Produto.findAll({
        where: {
          nome: { [Op.like]: nomeFiltro },//pega qualquer nome digitado como parametro de busca por nome
          preco: {[Op.lte]: precoMaximo}//defina o valor máximo que será buscado
        }
      })
        .then(function (produtos) {
          console.log(produtos);
    
          for (var i = 0; i < produtos.length; i++) {
            todosProdutos += "<tr>";
            todosProdutos += "<td>" + produtos[i].id; +"</td>"
            todosProdutos += "<td> " + produtos[i].codigo; +"</td>"
            todosProdutos += "<td> " + produtos[i].nome; +"</td>"
            todosProdutos += "<td> " + produtos[i].preco; +"</td>"
            todosProdutos += "<td> " + produtos[i].marca; +"</td>"
            todosProdutos += "<td><a href='/alteraProduto?id=" + produtos[i].id+ "'>Alterar</a></td>";
            todosProdutos += "</tr>";
          }
    
          todosProdutos +="</table>"
          res.send("<b>Veja nossos produtos</b><br>" + todosProdutos);
        })
        .catch(function (erro) {
          console.log("Erro na consulta: " + erro);
        });*/

  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////

  //var precoMaximo = req.body.precoMaximo;

  //var resultadodaBusca = [];
  /* produtos.forEach((produto) => {
    if (produto.nome.includes(nomeFiltro) && produto.preco <= precoMaximo) {
      resultadodaBusca.push(produto);
    }
  });*/

  //res.send(todosProdutos);
});

//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< EXCLUIR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< EXCLUIR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< EXCLUIR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< EXCLUIR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


app.get("/excluiProduto", (req, res) => {
  var idProduto = req.query.id;

  Produto.destroy({
    where: {
      id: idProduto,
    },
  })
    .then(function () {

      res.send("<b>Produto excluído com sucesso!</b><br>");
    })
    .catch(function (erro) {
      console.log("Erro na consulta: " + erro);
      res.send("Erro na exclusão: " + erro);
    });
});

app.listen(PORT, () => {
  console.log("http://localhost:" + 3000);
});
