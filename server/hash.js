const bcrypt = require("bcryptjs");

async function generateHash() {
  const password = "admin123";   // admin login password

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log("Hashed password:", hash);
}

generateHash();