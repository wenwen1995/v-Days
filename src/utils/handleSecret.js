const crypto = require('crypto');
const algorithm = 'aes192';

const key = "front web secret";

//加密
exports.encrypt = (text) => {
	let secret = crypto.createCipher(algorithm, key);
	let encrypted = secret.update(text,'utf8','hex');
    encrypted += secret.final('hex');
    return encrypted;
}

//解密
exports.decrypt = (text) => {
	let decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(text,'utf8','hex');
    decrypted += decipher.final('utf8');
    return decrypted;
}

