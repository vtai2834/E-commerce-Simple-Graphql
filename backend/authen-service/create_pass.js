const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  console.log(`✅ ${password} → ${hashed}`);
}

hashPassword('123456');
