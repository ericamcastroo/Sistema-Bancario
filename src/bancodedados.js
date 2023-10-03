module.exports = {
    banco: {
        nome: "Cubos Bank",
        numero: "123",
        agencia: "0001",
        senha: "Cubos123Bank",
    },
    contas: [
        {
            numero: "1",
            saldo: 3000,
            usuario: {
                nome: "Luisa Vitoria",
                cpf: "11122233344",
                data_nascimento: "1993-03-20",
                telefone: "71999998888",
                email: "luisav@hotmail.com",
                senha: "luisa123",
            },
        },
        {
            numero: "2",
            saldo: 1000,
            usuario: {
                nome: "Maria Flor",
                cpf: "33344455566",
                data_nascimento: "1998-06-10",
                telefone: "71988887777",
                email: "mariaf@gmail.com",
                senha: "maria123",
            },
        },
    ],
    saques: [],
    depositos: [],
    transferencias: [],
};

