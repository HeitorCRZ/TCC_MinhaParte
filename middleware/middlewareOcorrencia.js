module.exports = class MiddlewareOcorrencia {
    validarDadosForms(req, res, next) {
        console.log("Corpo da requisição:", req.body);
        console.log("Arquivo recebido:", req.file);

        const { matricula, relato, registroProfessor } = req.body;

        if (!matricula || !relato || !registroProfessor) {
            return res.status(400).json({
                error: 'Erro no envio dos dados! Campos obrigatórios ausentes.',
                status: false
            });
        }

        if (!req.file) {
            return res.status(400).json({
                error: 'Erro no envio do arquivo! Nenhum arquivo foi recebido.',
                status: false
            });
        }

        next();
    }
};
