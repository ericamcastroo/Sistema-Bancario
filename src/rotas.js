const express = require('express');

const {
    listarContas,
    criarConta,
    atualizarConta,
    excluirConta,
} = require("./controladores/contas");

const {
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    emitirExtrato
} = require('./controladores/transacoesContas.js')

const rotas = express.Router();

const { verificarSenha } = require("./intermediadores/verificarSenha");

rotas.get("/contas", listarContas);
rotas.post("/contas", criarConta);
rotas.put("/contas/:numeroConta/usuario", atualizarConta);
rotas.delete("/contas/:numeroConta", excluirConta);
rotas.post("/transacoes/depositar", depositar);
rotas.post("/transacoes/sacar", verificarSenha, sacar);
rotas.post("/transacoes/transferir", verificarSenha, transferir);
rotas.get("/contas/saldo", verificarSenha, consultarSaldo);
rotas.get("/contas/extrato", verificarSenha, emitirExtrato);

module.exports = {
    rotas,
};

