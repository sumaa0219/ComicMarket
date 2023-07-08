
module.exports = {
  reactStrictMode: false,
  serverRuntimeConfig: {
    // SSL証明書と秘密鍵のパスを指定
    api: {
      bodyParser: {
        sizeLimit: '1gb', // ボディサイズ制限を増やす（例: 1GB）
      },
    },
  },

};

