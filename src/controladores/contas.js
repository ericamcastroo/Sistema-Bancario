const bancoDeDados = require('../bancodedados.js');

function listarContas(req, res) {
  const { senha_banco } = req.query;

  if (senha_banco !== bancoDeDados.banco.senha) {
    return res.status(400).json({ mensagem: "A senha do banco informada é inválida!" });
  }

  const contas = contas.contas;

  res.json(contas);
}

function criarConta(req, res) {
  const {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
  } = req.body;

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
  }

  const cpfExistente = bancoDeDados.contas.some(
    (conta) => conta.usuario.cpf === cpf || conta.usuario.email === email
  );

  if (cpfExistente) {
    return res.status(400).json({ mensagem: "Já existe uma conta com o CPF ou e-mail informado!" });
  }

  const novaConta = {
    numero: (bancoDeDados.contas.length + 1).toString(),
    saldo: 0,
    usuario: {
      nome,
      cpf,
      data_nascimento,
      telefone,
      email,
      senha,
    },
  };

  bancoDeDados.contas.push(novaConta);
  res.status(201).end();
}
function atualizarConta(req, res) {
  const { numeroConta } = req.params;
  const {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
  } = req.body;

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
  }

  const contaExistente = bancoDeDados.contas.find((conta) => conta.numero === numeroConta);

  if (!contaExistente) {
    return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
  }

  const cpfExistente = bancoDeDados.contas.some(
    (conta) => conta.usuario.cpf === cpf && conta.numero !== numeroConta
  );

  if (cpfExistente) {
    return res.status(400).json({ mensagem: "O CPF informado já existe cadastrado!" });
  }

  const emailExistente = bancoDeDados.contas.some(
    (conta) => conta.usuario.email === email && conta.numero !== numeroConta
  );

  if (emailExistente) {
    return res.status(400).json({ mensagem: "O email informado já existe cadastrado!" });
  }

  const contaAtualizada = bancoDeDados.contas.find(
    (conta) => conta.numero === numeroConta
  );

  contaAtualizada.usuario = {
    nome,
    cpf,
    data_nascimento,
    telefone,
    email,
    senha,
  };

  res.status(204).end();
}

function excluirConta(req, res) {
  const numeroConta = req.params.numeroConta;

  const conta = bancodedados.contas.find((c) => c.numero === numeroConta);

  if (!conta) {
    return res.status(404).json({ mensagem: 'Conta bancária não encontrada!' });
  }

  if (conta.saldo !== 0) {
    return res.status(400).json({ mensagem: 'A conta só pode ser removida se o saldo for zero!' });
  }

  bancodedados.contas = bancodedados.contas.filter((c) => c.numero !== numeroConta);

  res.status(204).send();
}

module.exports = {
  listarContas,
  criarConta,
  atualizarConta,
  excluirConta
};