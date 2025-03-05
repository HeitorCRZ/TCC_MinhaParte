const express = require('express');
const Ocorrencia = require("../modelo/Ocorrencias");

module.exports = class ControlOcorrencia {
    async controle_ocorrencias_RegistrarOcorrenciaProfessor(req, res) {
        try {
            const objOcorrencia = new Ocorrencia();

            objOcorrencia.relatoProfessor = req.body.relato;
            objOcorrencia.matriculaAluno = req.body.matricula;
            objOcorrencia.registroProfessor = req.body.registroProfessor;
            
           
            if (req.file) {
                objOcorrencia.arquivo = req.file.buffer;
            }
            console.log("teste relato -->"+objOcorrencia.relatoProfessor );
            console.log("teste arquivo -->"+objOcorrencia.arquivo );

            const ocorrenciaRegistrada = await objOcorrencia.create_ocorrenciaProfessor();

            if (ocorrenciaRegistrada) {
                return res.status(200).json({
                    status: true,
                    msg: "Ocorrência Registrada",
                });
            } else {
                return res.status(404).json({ msg: "Não existe esse aluno" });
            }
        } catch (error) {
            console.error("Erro ao registrar ocorrência:", error);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }
};
