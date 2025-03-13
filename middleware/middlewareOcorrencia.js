const Aluno = require("../modelo/Alunos");
const express = require('express');

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

     async validarMatricula(req, res, next) {
        console.log("Corpo da requisição:", req.body);

        try {
            console.log("Chegou verificarMatricula");
            const matricula = req.body.matricula;
      
            const objAluno = new Aluno()
            objAluno.matricula = matricula
      
            const alunoExistente = await objAluno.getAluno();
      
            if (!alunoExistente) {
              return res.status(404).json({
                error: 'Aluno não encontrado.',
                status: false
              });
            } else {
              next()
            }
      
        } catch (error) {
        console.error('Erro ao verificar aluno:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
};
