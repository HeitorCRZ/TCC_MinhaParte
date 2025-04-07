const express = require('express');
const ControlOcorrencia = require('../controle/controleOcorrencias');
const MiddlewareOcorrencia = require('../middleware/middlewareOcorrencia');
const multer = require("multer");
const path = require("path");

// Configuração do multer para salvar o arquivo no disco
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde os arquivos serão salvos
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.docx', '.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não permitido. Apenas PDF, DOCX, JPG, JPEG e PNG são aceitos.'), false);
        }
    }
});

module.exports = class RouterOcorrencia {    constructor() {
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
                (req, res) => this._controleOcorrencia.controle_ocorrencias_RegistrarOcorrenciaProfessor(req, res)
            );
            this._router.get(
                '/buscarDadosOcorrenciasPendentes', 
                upload.single("arquivo"), 
                (req, res) => this._controleOcorrencia.controle_ocorrencias_buscarDadosOcorrenciasPendentes(req, res)
            );
            return this._router;
        } catch (error) {
            console.error("Erro no roteador de ocorrências:", error);
        }
    }
};
