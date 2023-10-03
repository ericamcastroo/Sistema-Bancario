function verificarSenha(req, res, next) {

    const { senha } = req.query;

    if (senha !== "1234") {

        return res.status(401).json({ mensagem: "senha incorreta" });
    }

    next();
}

module.exports = {
    verificarSenha,
};