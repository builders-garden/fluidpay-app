import nacl from "tweetnacl";
import forge from "node-forge";
import { Buffer } from "buffer";

const randomBytes = (size, callback) => {
  if (typeof size !== "number") {
    throw new TypeError("Expected number");
  }
  const bytes = Buffer.from(nacl.randomBytes(size));
  if (callback) {
    callback(null, bytes);
    return;
  }
  return bytes;
};

const createHash = (algorithm) => {
  const md = forge.md[algorithm.toLowerCase()].create();
  return {
    update: function (data) {
      md.update(
        typeof data === "string" ? data : forge.util.createBuffer(data)
      );
      return this;
    },
    digest: function (encoding) {
      const digest = md.digest().getBytes();
      return encoding === "hex"
        ? forge.util.bytesToHex(digest)
        : Buffer.from(digest, "binary");
    },
  };
};

const createCipheriv = (algorithm, key, iv) => {
  const cipher = forge.cipher.createCipher(
    algorithm,
    forge.util.createBuffer(key)
  );
  cipher.start({ iv: forge.util.createBuffer(iv) });
  let output = forge.util.createBuffer();

  return {
    update: (data) => {
      cipher.update(forge.util.createBuffer(data));
      output.putBuffer(cipher.output);
      return Buffer.from(output.getBytes(), "binary");
    },
    final: () => {
      cipher.finish();
      output.putBuffer(cipher.output);
      const result = Buffer.from(output.getBytes(), "binary");
      output.clear();
      return result;
    },
    getAuthTag: () => {
      if (algorithm.includes("gcm")) {
        return Buffer.from(cipher.mode.tag.getBytes(), "binary");
      }
      throw new Error("getAuthTag is only supported for GCM mode");
    },
  };
};

const createDecipheriv = (algorithm, key, iv) => {
  const decipher = forge.cipher.createDecipher(
    algorithm,
    forge.util.createBuffer(key)
  );
  decipher.start({ iv: forge.util.createBuffer(iv) });
  let output = forge.util.createBuffer();
  let authTag;

  return {
    update: (data) => {
      decipher.update(forge.util.createBuffer(data));
      output.putBuffer(decipher.output);
      return Buffer.from(output.getBytes(), "binary");
    },
    final: () => {
      decipher.finish();
      output.putBuffer(decipher.output);
      const result = Buffer.from(output.getBytes(), "binary");
      output.clear();
      return result;
    },
    setAuthTag: (tag) => {
      if (algorithm.includes("gcm")) {
        authTag = tag;
        decipher.mode.tag = forge.util.createBuffer(tag);
      } else {
        throw new Error("setAuthTag is only supported for GCM mode");
      }
    },
  };
};

const pbkdf2 = (password, salt, iterations, keylen, digest, callback) => {
  try {
    const derivedKey = forge.pkcs5.pbkdf2(
      password,
      salt,
      iterations,
      keylen,
      digest
    );
    const result = Buffer.from(derivedKey, "binary");
    if (callback) {
      callback(null, result);
    } else {
      return result;
    }
  } catch (error) {
    if (callback) {
      callback(error);
    } else {
      throw error;
    }
  }
};

const randomFillSync = (buffer, offset, size) => {
  const randomBytes = nacl.randomBytes(size);
  buffer.set(randomBytes, offset);
  return buffer;
};

const timingSafeEqual = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
};

const cryptoPolyfill = {
  randomBytes,
  createHash,
  createCipheriv,
  createDecipheriv,
  pbkdf2,
  randomFillSync,
  timingSafeEqual,
};

cryptoPolyfill.default = cryptoPolyfill;

module.exports = {
  randomBytes,
  createHash,
  createCipheriv,
  createDecipheriv,
  pbkdf2,
  randomFillSync,
  timingSafeEqual,
};

export default cryptoPolyfill;
