const Aluno = require("../modelo/Alunos");
const express = require('express');

module.exports = class MiddlewareOcorrencia {
    async validarDadosForms(req, res, next) {
        console.log("Corpo da requisição:", req.body);
        console.log("Arquivo recebido:", req.file);
    
        try {
            const matriculas = JSON.parse(req.body.matriculas); // Esse sim precisa de parse
            const relato = req.body.relato; // String simples
            const registroProfessor = req.body.registroProfessor; // String simples
    
            if (!matriculas || !relato || !registroProfessor) {
                return res.status(400).json({
                    error: 'Erro no envio dos dados! Campos obrigatórios ausentes.',
                    status: false
                });
            }
    
            const objAluno = new Aluno();
            for (let matricula of matriculas) {
                objAluno.matricula = matricula;
                const alunoExistente = await objAluno.getAluno();
                if (!alunoExistente) {
                    return res.status(404).json({
                        error: `Matrícula: ${matricula} não foi encontrada`,
                        status: false
                    });
                }
            }
    
            next();
        } catch (error) {
            console.error('Erro ao validar dados:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
    

};