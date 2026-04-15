const bcrypt = require('bcrypt');

const senha = '445801'; // 👈 TROCA PELA SENHA QUE VOCÊ QUER

bcrypt.hash(senha, 10).then(hash => {
  console.log('HASH GERADO:');
  console.log(hash);
});