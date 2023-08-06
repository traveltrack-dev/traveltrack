const argon2 = require('argon2');

const password = "a very long password blablablabla";

(async () => {
    console.log('hashing password...');
    const hash = await argon2.hash(password);
    console.log(hash);
})();

