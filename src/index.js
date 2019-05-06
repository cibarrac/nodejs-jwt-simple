const app = require('./app');
require('./db');

async function main() {
  await app.listen(4000);
  console.log('4000');
}

main();