const express = require('express');
const Ocorrencia = require("../modelo/Ocorrencias");

module.exports = class ControlOcorrencia {
    async controle_ocorrencias_RegistrarOcorrenciaProfessor(req, res) {
        try {
            const objOcorrencia = new Ocorrencia();

            objOcorrencia.relatoProfessor = req.body.relato;
            objOcorrencia.registroProfessor = req.body.registroProfessor
            if (req.file) {
                objOcorrencia.arquivo = req.file.filename;

            }
        
            const idOcorrencia = await objOcorrencia.create_ocorrenciaProfessor_ocorrencia();

            if (idOcorrencia != null) {
                objOcorrencia.idOcorrencia = idOcorrencia;
                const matriculas = JSON.parse(req.body.matriculas);
                let ocorrenciaFinalizada = false;
                for (let matricula of matriculas) {
                    objOcorrencia.matriculaAluno = matricula;
                    ocorrenciaFinalizada = await objOcorrencia.create_ocorrenciaProfessor_aluno();
                }
                if (ocorrenciaFinalizada){
                    return res.status(200).json({
                        status: true,
                        msg: "Ocorrência Registrada",
                    });
                } else {
                    return res.status(404).json({ msg: "Erro ao vincular alunos a ocorrencia" });
                }
            } else {
                return res.status(404).json({ msg: "Erro ao registrar ocorrencia no banco" });
            }
        } catch (error) {
            console.error("Erro ao registrar ocorrência:", error);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }
}