import SimpleCrypto from "simple-crypto-js";

export const passEncrypt = pass => {
  if (pass) {
    var _secretKey =
      "3EE56DCD3F2654687A96B126ED21FEF239A3DCA3D6B57169DA4AA39FB33C9BAE";
    var simpleCrypto = new SimpleCrypto(_secretKey);
    return simpleCrypto.encrypt(pass);
  }
};

export const passDecrypt = pass => {
  if (pass) {
    var _secretKey =
      "3EE56DCD3F2654687A96B126ED21FEF239A3DCA3D6B57169DA4AA39FB33C9BAE";
    var simpleCrypto = new SimpleCrypto(_secretKey);
    return simpleCrypto.decrypt(pass);
  }
};
