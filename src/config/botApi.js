const axios = require("axios");

// Pode ser algum servidor executando localmente: 
// http://localhost:3000

const botApi = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

module.exports = botApi;