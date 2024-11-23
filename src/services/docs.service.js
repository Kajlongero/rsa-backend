require("dotenv").config();

const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

class DocsService {
  constructor() {
    this.publickey = fs.readFileSync("src/keys/public/pub.pem");
    this.privatekey = fs.readFileSync("src/keys/private/priv.pem");
  }

  getRsaPublic() {
    return this.publickey;
  }

  async #base64ToArrayBuffer(base64Array) {
    const arrayBuffer = base64Array.map((base64) => {
      const binaryString = atob(base64);

      const size = binaryString.length;
      const bytes = new Uint8Array(size);

      for (let i = 0; i < size; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      return bytes.buffer;
    });

    return arrayBuffer;
  }

  async decryptFunc(encrypted) {
    try {
      const decrypt = await crypto.privateDecrypt(
        {
          key: this.privatekey,
          passphrase: process.env.CIPHER_PASSPHRASE,
          oaepHash: "SHA-256",
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        encrypted
      );

      return decrypt;
    } catch (error) {
      return null;
    }
  }

  async decrypt(body) {
    const extname = path.extname(body.info.filename ?? "test.docx");
    const buffer = await this.#base64ToArrayBuffer(body.data);

    const res = await Promise.all(
      buffer.map((elem) => {
        return this.decryptFunc(elem);
      })
    );

    const joinBuffer = res.filter((elem) => elem !== null);
    const concat = Buffer.concat(joinBuffer);

    fs.writeFile(
      `src/output/${crypto.randomUUID()}${extname}`,
      concat,
      (error) => {
        if (error) console.error(error);
      }
    );

    return {
      error: false,
      message: "File uploaded successfully",
      statusCode: 200,
    };
  }
}

module.exports = DocsService;
