const Filme = require('./filme.model');
const Diretor = require('./diretor.model');
const Artista = require('./artista.model');

Filme.belongsTo(Diretor, {
  foreignKey: 'diretorId',
  as: 'diretor'
});

Diretor.hasMany(Filme, {
  foreignKey: 'diretorId',
  as: 'filmes'
});

Filme.belongsToMany(Artista, {
  through: 'FilmeArtista',
  foreignKey: 'filmeId',
  otherKey: 'artistaId',
  as: 'artistas'
});

Artista.belongsToMany(Filme, {
  through: 'FilmeArtista',
  foreignKey: 'artistaId',
  otherKey: 'filmeId',
  as: 'filmes'
});