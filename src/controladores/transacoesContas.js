const bancoDeDados = require('../bancodedados.js');

function depositar(req, res) {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || valor === undefined || valor <= 0) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios e devem ser maiores que zero!" });
    }

    const contaExistente = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

    if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    contaExistente.saldo += valor;

    const transacaoDeposito = {
        data: new Date().toISOString(),
        numero_conta,
        valor,
    };

    bancoDeDados.depositos.push(transacaoDeposito);

    res.status(204).end();
}

function sacar(req, res) {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || valor === undefined || valor <= 0 || !senha) {
        return res.status(400).json({ mensagem: "O número da conta, valor do saque e senha são obrigatórios e o valor deve ser maior que zero!" });
    }

    const contaExistente = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

    if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    if (contaExistente.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha incorreta!" });
    }

    if (valor > contaExistente.saldo) {
        return res.status(400).json({ mensagem: "Saldo insuficiente para realizar o saque!" });
    }

    contaExistente.saldo -= valor;

    const transacaoSaque = {
        data: new Date().toISOString(),
        numero_conta,
        valor,
    };

    bancoDeDados.saques.push(transacaoSaque);

    res.status(204).end();
}

function transferir(req, res) {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
    }
    const contaOrigem = bancoDeDados.contas.find(conta => conta.numero === numero_conta_origem);
    if (!contaOrigem) {
        return res.status(404).json({ mensagem: "Conta de origem não encontrada." });
    }
    const contaDestino = bancoDeDados.contas.find(conta => conta.numero === numero_conta_destino);
    if (!contaDestino) {
        return res.status(404).json({ mensagem: "Conta de destino não encontrada." });
    }
    if (senha !== contaOrigem.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta para a conta de origem." });
    }
    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente." });
    }
    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const transferencia = {
        data: new Date().toLocaleString(),
        numero_conta_origem,
        numero_conta_destino,
        valor
    };
    bancoDeDados.transferencias.push(transferencia);

    res.status(200).send();
}

function consultarSaldo(req, res) {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e a senha são obrigatórios!" });
    }

    const contaExistente = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

    if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    if (contaExistente.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha incorreta!" });
    }

    const saldo = contaExistente.saldo;

    res.status(200).json({ saldo });
}

function emitirExtrato(req, res) {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "O número da conta e a senha são obrigatórios!" });
    }

    const contaExistente = bancoDeDados.contas.find((conta) => conta.numero === numero_conta);

    if (!contaExistente) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    if (contaExistente.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha incorreta!" });
    }

    const extrato = {
        depositos: bancoDeDados.depositos.filter((deposito) => deposito.numero_conta === numero_conta),
        saques: bancoDeDados.saques.filter((saque) => saque.numero_conta === numero_conta),
        transferenciasEnviadas: bancoDeDados.transferencias.filter((transferencia) => transferencia.numero_conta_origem === numero_conta),
        transferenciasRecebidas: bancoDeDados.transferencias.filter((transferencia) => transferencia.numero_conta_destino === numero_conta),
    };

    res.status(200).json(extrato);
}

module.exports = {
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    emitirExtrato
};