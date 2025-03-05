const Banco = require("./Banco");

module.exports = class Ocorrencia {
    constructor() {
        this._matriculaAluno = null;
        this._relatoProfessor = null;
        this._arquivo = null;
        this._registroProfessor = null;
    }

    async create_ocorrenciaProfessor() { 
        const conexao = Banco.getConexao();
        const mysql = "INSERT INTO ocorrencia (Aluno_matricula, relatoFuncionario, momento, arquivo, Funcionario_registro_Professor, status) VALUES (?, ?, NOW(), ?, ?, 0);";
        console.log("Valores inseridos:", {
            matriculaAluno: this._matriculaAluno,
            relatoProfessor: this._relatoProfessor,
            arquivo: this._arquivo,
            registroProfessor: this._registroProfessor
        });
        
        try {
            const [result] = await conexao.promise().execute(mysql, [ 
                this._matriculaAluno,
                this._relatoProfessor,
                this._arquivo,
                this._registroProfessor
            ]);
            return result.affectedRows > 0;
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
};
