const Banco = require("./Banco");

module.exports = class Ocorrencia {
    constructor() {
        this._matriculaAluno = null;
        this._relatoProfessor = null;
        this._arquivo = null;
        this._registroProfessor = null;
        this._idOcorrencia = null;
    }

    async create_ocorrenciaProfessor_ocorrencia() { 
        const conexao = Banco.getConexao();
        const mysql = "INSERT INTO ocorrencia (Funcionario_registro_Professor, relatoFuncionario, momento, statusOcorrencia, arquivo) VALUES (?, ?, NOW(), 0, ?);";
        
        console.log("Valores inseridos:", {
            relatoProfessor: this._relatoProfessor,
            arquivo: this._arquivo,
            registroProfessor: this._registroProfessor
        });
        
        try {
            const [result] = await conexao.promise().execute(mysql, [ 
                this._registroProfessor,
                this._relatoProfessor,
                this._arquivo
            ]);
            
            return result.insertId; 
        } catch (error) {
            console.log("Erro>>" + error);
            return null;
        }
    }
    
    async create_ocorrenciaProfessor_aluno() { 
        const conexao = Banco.getConexao();
        const mysql = "INSERT INTO ocorrencia_aluno (idOcorrencia, Aluno_matricula) VALUES (?, ?);";
        
        console.log("Valores inseridos:", {
            idOcorrencia: this._idOcorrencia,
            matriculaAluno: this._matriculaAluno
        });
        
        try {
            const [result] = await conexao.promise().execute(mysql, [ 
                this._idOcorrencia,
                this._matriculaAluno
            ]);
            
            return  result.affectedRows > 0;
        } catch (error) {
            console.log("Erro>>" + error);
            return false;
        }
    }

    get matriculaAluno() {
        return this._matriculaAluno;
    }

    set matriculaAluno(valor) {
        this._matriculaAluno = valor;
    }

    get relatoProfessor() {
        return this._relatoProfessor;
    }

    set relatoProfessor(valor) {
        this._relatoProfessor = valor;
    }

    get arquivo() {
        return this._arquivo;
    }

    set arquivo(valor) {
        this._arquivo = valor;
    }

    get registroProfessor() {
        return this._registroProfessor;
    }

    set registroProfessor(valor) {
        this._registroProfessor = valor;
    }

    get idOcorrencia() {
        return this._idOcorrencia;
    }
    
    set idOcorrencia(valor) {
        this._idOcorrencia = valor;
    }
    
};