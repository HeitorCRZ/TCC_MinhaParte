const express = require('express');
const ControlOcorrencia = require('../controle/controleOcorrencias');
const MiddlewareOcorrencia = require('../middleware/middlewareOcorrencia');
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() }); 
 

module.exports = class RouterOcorrencia {
    constructor() {
        this._router = express.Router();
        this._controleOcorrencia = new ControlOcorrencia();
        this._middleOcorrencia = new MiddlewareOcorrencia();
    }

    criarRotasOcorrencia() {
        try {
            this._router.post(
                '/cadastrar', 
                upload.single("arquivo"), 
                (req, res, next) => this._middleOcorrencia.validarDadosForms(req, res, next),
                (req, res, next) => this._middleOcorrencia.validarMatricula(req, res, next),
                (req, res) => this._controleOcorrencia.controle_ocorrencias_RegistrarOcorrenciaProfessor(req, res)
            );
            return this._router;
        } catch (error) {
            console.error("Erro no roteador de ocorrências:", error);
        }
    }
};
