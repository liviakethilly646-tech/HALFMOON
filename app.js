const express = require('express');
const exphbs = require('express-handlebars');
const sequelize = require('./config/bd');

const Filme = require('./models/filme.model');
const Diretor = require('./models/diretor.model');
const Artista = require('./models/artista.model');

const methodOverride = require('method-override');

const app = express();

require('./models/relacionamentosModels');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', exphbs.engine({
  defaultLayout: false
}));

app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('home', {
    titulo: 'Pagina Inicial'
  });
});


app.get('/filmes', async (req, res) => {
  try {
    const filmes = await Filme.findAll({
      include: [
        { model: Diretor, as: 'diretor', required: false },
        { model: Artista, as: 'artistas', required: false }
      ]
    });

    res.render('filmes', {
      filmes: filmes.map(filme => filme.toJSON()),
      mensagem: req.query.mensagem, // Lida da URL
      tipo: req.query.tipo          // Lida da URL
    });

  } catch (erro) {
    console.error('ERRO AO LISTAR FILMES:', erro);
    res.status(500).send('Erro ao listar filmes.');
  }
});


app.get('/filmes/cadastrar', async (req, res) => {
  try {
    const diretores = await Diretor.findAll({
      raw: true
    });

    const artistas = await Artista.findAll({
      raw: true
    });

    res.render('cadastrarFilme', {
      diretores: diretores,
      artistas: artistas
    });

  } catch (erro) {
    console.error('ERRO AO CARREGAR FORMULARIO DE FILME:');
    console.error(erro);

    res.status(500).send('Erro ao carregar formulario.');
  }
});


app.post('/filmes', async (req, res) => {
  try {
    const nome = req.body.nome;
    const ano = req.body.ano;
    const diretorId = req.body.diretorId;
    const artistas = req.body.artistas || [];

    const filme = await Filme.create({
      nome: nome,
      ano: ano,
      diretorId: diretorId
    });

    if (artistas.length > 0) {
      await filme.setArtistas(artistas);
    }

    res.redirect('/filmes');

  } catch (erro) {
    console.error('ERRO AO CADASTRAR FILME:');
    console.error(erro);

    res.status(500).send('Erro ao cadastrar filme.');
  }
});


app.get('/filmes/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const filme = await Filme.findByPk(id, {
      include: [
        {
          model: Diretor,
          as: 'diretor',
          required: false
        },
        {
          model: Artista,
          as: 'artistas',
          required: false
        }
      ]
    });

    if (!filme) {
      return res.status(404).send('Filme nao encontrado.');
    }

    res.render('detalharFilme', {
      filme: filme.toJSON()
    });

  } catch (erro) {
    console.error('ERRO AO BUSCAR FILME:');
    console.error(erro);

    res.status(500).send('Erro ao buscar filme.');
  }
});


app.get('/filmes/:id/editar', async (req, res) => {
  try {
    const id = req.params.id;

    const filme = await Filme.findByPk(id, {
      raw: true
    });

    if (!filme) {
      return res.status(404).send('Filme nao encontrado.');
    }

    res.render('editarFilme', {
      filme: filme
    });

  } catch (erro) {
    console.error('ERRO AO CARREGAR EDICAO:');
    console.error(erro);

    res.status(500).send('Erro ao carregar edicao.');
  }
});


app.put('/filmes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const nome = req.body.nome;
    const ano = req.body.ano;

    const filme = await Filme.findByPk(id);

    if (!filme) {
      return res.status(404).send('Filme nao encontrado.');
    }

    filme.nome = nome;
    filme.ano = ano;

    await filme.save();

    res.redirect('/filmes');

  } catch (erro) {
    console.error('ERRO AO EDITAR FILME:');
    console.error(erro);

    res.status(500).send('Erro ao editar filme.');
  }
});


app.delete('/filmes/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const filme = await Filme.findByPk(id);

    if (!filme) {
      return res.status(404).send('Filme nao encontrado.');
    }

    await filme.destroy();

    res.redirect('/filmes');

  } catch (erro) {
    console.error('ERRO AO EXCLUIR FILME:');
    console.error(erro);

    res.status(500).send('Erro ao excluir filme.');
  }
});



app.get('/diretores', async (req, res) => {
  try {
    const diretores = await Diretor.findAll({
      raw: true
    });

    res.render('diretores', {
      diretores: diretores
    });

  } catch (erro) {
    console.error('ERRO AO LISTAR DIRETORES:');
    console.error(erro);

    res.status(500).send('Erro ao listar diretores.');
  }
});


app.get('/diretores/cadastrar', (req, res) => {
  res.render('cadastrarDiretor');
});


app.post('/diretores', async (req, res) => {
  try {
    const nome = req.body.nome;
    const anoNascimento = req.body.anoNascimento;
    const nacionalidade = req.body.nacionalidade;
    const filmesDirigidos = req.body.filmesDirigidos;

    await Diretor.create({
      nome: nome,
      anoNascimento: anoNascimento,
      nacionalidade: nacionalidade,
      filmesDirigidos: filmesDirigidos,
    });

    res.redirect('/diretores');

  } catch (erro) {
    console.error('ERRO AO CADASTRAR DIRETOR:');
    console.error(erro);

    res.status(500).send('Erro ao cadastrar diretor.');
  }
});


app.get('/diretores/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const diretor = await Diretor.findByPk(id, {
      include: [
        {
          model: Filme,
          as: 'filmes',
          required: false
        }
      ]
    });

    if (!diretor) {
      return res.status(404).send('Diretor nao encontrado.');
    }

    res.render('detalharDiretor', {
      diretor: diretor.toJSON()
    });

  } catch (erro) {
    console.error('ERRO AO BUSCAR DIRETOR:');
    console.error(erro);

    res.status(500).send('Erro ao buscar diretor.');
  }
});



app.get('/artistas', async (req, res) => {
  try {
    const artistas = await Artista.findAll({
      raw: true
    });

    res.render('artistas', {
      artistas: artistas
    });

  } catch (erro) {
    console.error('ERRO AO LISTAR ARTISTAS:');
    console.error(erro);

    res.status(500).send('Erro ao listar artistas.');
  }
});


app.get('/artistas/cadastrar', (req, res) => {
  res.render('cadastrarArtista');
});


app.post('/artistas', async (req, res) => {
  try {
    const nome = req.body.nome;
    const anoNascimento = req.body.anoNascimento;
    const nomeArtistico = req.body.nomeArtistico;

    await Artista.create({
      nome: nome,
      anoNascimento: anoNascimento,
      nomeArtistico: nomeArtistico
    });

    res.redirect('/artistas');

  } catch (erro) {
    console.error('ERRO AO CADASTRAR ARTISTA:');
    console.error(erro);

    res.status(500).send('Erro ao cadastrar artista.');
  }
});


app.get('/artistas/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const artista = await Artista.findByPk(id, {
      include: [
        {
          model: Filme,
          as: 'filmes',
          required: false
        }
      ]
    });

    if (!artista) {
      return res.status(404).send('Artista nao encontrado.');
    }

    res.render('detalharArtista', {
      artista: artista.toJSON()
    });

  } catch (erro) {
    console.error('ERRO AO BUSCAR ARTISTA:');
    console.error(erro);

    res.status(500).send('Erro ao buscar artista.');
  }
});

app.get('/halfmoon', (req, res) => {
  res.render('home2', {
    titulo: 'Pagina Inicial'
  });
});

app.get('/filmes2', async (req, res) => {
  try {
    const filmes = await Filme.findAll({
      include: [
        {
          model: Diretor,
          as: 'diretor',
          required: false
        },
        {
          model: Artista,
          as: 'artistas',
          required: false
        }
      ]
    });

    res.render('filmes2', {
      filmes: filmes.map(filme => filme.toJSON())
    });

  } catch (erro) {
    console.error('ERRO AO LISTAR FILMES:');
    console.error(erro);

    res.status(500).send('Erro ao listar filmes.');
  }
});


app.get('/filmes2/cadastrar2', async (req, res) => {
  try {
    const diretores = await Diretor.findAll({
      raw: true
    });

    const artistas = await Artista.findAll({
      raw: true
    });

    res.render('cadastrarFilme2', {
      diretores: diretores,
      artistas: artistas
    });

  } catch (erro) {
    console.error('ERRO AO CARREGAR FORMULARIO DE FILME:');
    console.error(erro);

    res.status(500).send('Erro ao carregar formulario.');
  }
});


app.post('/filmes2', async (req, res) => {
  try {
    const nome = req.body.nome;
    const ano = req.body.ano;
    const diretorId = req.body.diretorId;
    const artistas = req.body.artistas || [];

    const filme = await Filme.create({
      nome: nome,
      ano: ano,
      diretorId: diretorId
    });

    if (artistas.length > 0) {
      await filme.setArtistas(artistas);
    }

    res.redirect('/filmes2');

  } catch (erro) {
    console.error('ERRO AO CADASTRAR FILME:');
    console.error(erro);

    res.status(500).send('Erro ao cadastrar filme.');
  }
});


app.get('/filmes2/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const filme = await Filme.findByPk(id, {
      include: [
        {
          model: Diretor,
          as: 'diretor',
          required: false
        },
        {
          model: Artista,
          as: 'artistas',
          required: false
        }
      ]
    });

    if (!filme) {
      return res.status(404).send('Filme nao encontrado.');
    }

    res.render('detalharFilme2', {
      filme: filme.toJSON()
    });

  } catch (erro) {
    console.error('ERRO AO BUSCAR FILME:');
    console.error(erro);

    res.status(500).send('Erro ao buscar filme.');
  }
});


app.get('/filmes2/:id/editar2', async (req, res) => {
  try {
    const id = req.params.id;

    const filme = await Filme.findByPk(id, {
      raw: true
    });

    if (!filme) {
      return res.status(404).send('Filme nao encontrado.');
    }

    res.render('editarFilme2', {
      filme: filme
    });

  } catch (erro) {
    console.error('ERRO AO CARREGAR EDICAO:');
    console.error(erro);

    res.status(500).send('Erro ao carregar edicao.');
  }
});


app.put('/filmes2/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const nome = req.body.nome;
    const ano = req.body.ano;

    const filme = await Filme.findByPk(id);

    if (!filme) {
      return res.status(404).send('Filme nao encontrado.');
    }

    filme.nome = nome;
    filme.ano = ano;

    await filme.save();

    res.redirect('/filmes2');

  } catch (erro) {
    console.error('ERRO AO EDITAR FILME:');
    console.error(erro);

    res.status(500).send('Erro ao editar filme.');
  }
});


app.delete('/filmes2/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const filme = await Filme.findByPk(id);

    if (!filme) {
      return res.status(404).send('Filme nao encontrado.');
    }

    await filme.destroy();

    res.redirect('/filmes2');

  } catch (erro) {
    console.error('ERRO AO EXCLUIR FILME:');
    console.error(erro);

    res.status(500).send('Erro ao excluir filme.');
  }
});

app.get('/diretores2', async (req, res) => {
  try {
    const diretores = await Diretor.findAll({
      raw: true
    });

    res.render('diretores2', {
      diretores: diretores
    });

  } catch (erro) {
    console.error('ERRO AO LISTAR DIRETORES:');
    console.error(erro);

    res.status(500).send('Erro ao listar diretores.');
  }
});


app.get('/diretores2/cadastrar2', (req, res) => {
  res.render('cadastrarDiretor2');
});


app.post('/diretores2', async (req, res) => {
  try {
    const nome = req.body.nome;
    const anoNascimento = req.body.anoNascimento;
    const nacionalidade = req.body.nacionalidade;
    const filmesDirigidos = req.body.filmesDirigidos;

    await Diretor.create({
      nome: nome,
      anoNascimento: anoNascimento,
      nacionalidade: nacionalidade,
      filmesDirigidos: filmesDirigidos,
    });

    res.redirect('/diretores2');

  } catch (erro) {
    console.error('ERRO AO CADASTRAR DIRETOR:');
    console.error(erro);

    res.status(500).send('Erro ao cadastrar diretor.');
  }
});


app.get('/diretores2/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const diretor = await Diretor.findByPk(id, {
      include: [
        {
          model: Filme,
          as: 'filmes',
          required: false
        }
      ]
    });

    if (!diretor) {
      return res.status(404).send('Diretor nao encontrado.');
    }

    res.render('detalharDiretor2', {
      diretor: diretor.toJSON()
    });

  } catch (erro) {
    console.error('ERRO AO BUSCAR DIRETOR:');
    console.error(erro);

    res.status(500).send('Erro ao buscar diretor.');
  }
});




app.get('/artistas2', async (req, res) => {
  try {
    const artistas = await Artista.findAll({
      raw: true
    });

    res.render('artistas2', {
      artistas: artistas
    });

  } catch (erro) {
    console.error('ERRO AO LISTAR ARTISTAS:');
    console.error(erro);

    res.status(500).send('Erro ao listar artistas.');
  }
});


app.get('/artistas2/cadastrar2', (req, res) => {
  res.render('cadastrarArtista2');
});


app.post('/artistas2', async (req, res) => {
  try {
    const nome = req.body.nome;
    const anoNascimento = req.body.anoNascimento;
    const nomeArtistico = req.body.nomeArtistico;

    await Artista.create({
      nome: nome,
      anoNascimento: anoNascimento,
      nomeArtistico: nomeArtistico
    });

    res.redirect('/artistas2');

  } catch (erro) {
    console.error('ERRO AO CADASTRAR ARTISTA:');
    console.error(erro);

    res.status(500).send('Erro ao cadastrar artista.');
  }
});


app.get('/artistas2/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const artista = await Artista.findByPk(id, {
      include: [
        {
          model: Filme,
          as: 'filmes',
          required: false
        }
      ]
    });

    if (!artista) {
      return res.status(404).send('Artista nao encontrado.');
    }

    res.render('detalharArtista2', {
      artista: artista.toJSON()
    });

  } catch (erro) {
    console.error('ERRO AO BUSCAR ARTISTA:');
    console.error(erro);

    res.status(500).send('Erro ao buscar artista.');
  }
});


async function conectarBD() {
  try {
    await sequelize.sync();

    console.log('Conexao com o banco de dados estabelecida com sucesso!');
  } catch (erro) {
    console.error('ERRO AO CONECTAR COM O BANCO:');
    console.error(erro);
  }
}

conectarBD();


app.listen(3000, () => {
  console.log('Servidor executando em http://localhost:3000');
});