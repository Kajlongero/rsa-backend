const crypto = require("crypto");
const fs = require("fs");

const generatePair = (public, private) => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  fs.writeFileSync(public + "/pub.pem", publicKey);
  fs.writeFileSync(private + "/priv.pem", privateKey);
};

module.exports = generatePair;
