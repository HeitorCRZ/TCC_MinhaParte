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
    async getDadosBasicosOcorrencias() {
        const sql = `
            SELECT  
                o.idOcorrencia,
                o.relatoFuncionario,
                f.nome AS nomeFuncionario,
                o.momento
            FROM ocorrencia o
            JOIN funcionario f ON o.Funcionario_registro_Professor = f.registro
            WHERE o.statusOcorrencia = 0
            ORDER BY o.momento ASC
        `;
        const conexao = Banco.getConexao();
        const [rows] = await conexao.promise().execute(sql);
        return rows;
    }
    async  getTurmasPorOcorrencia() {
        const sql = `
            SELECT 
                o.idOcorrencia,
                GROUP_CONCAT(DISTINCT a.turma ORDER BY a.turma SEPARATOR ', ') AS turmas
            FROM ocorrencia o
            JOIN ocorrencia_aluno oa ON o.idOcorrencia = oa.idOcorrencia
            JOIN aluno a ON oa.Aluno_matricula = a.matricula
            WHERE o.statusOcorrencia = 0
            GROUP BY o.idOcorrencia
        `;
        const conexao = Banco.getConexao();
        const [rows] = await conexao.promise().execute(sql);
        return rows;
    }

    async  getQuantidadeAlunosPorOcorrencia() {
        const sql = `
            SELECT 
                o.idOcorrencia,
                COUNT(DISTINCT a.matricula) AS quantidadeAlunos
            FROM ocorrencia o
            JOIN ocorrencia_aluno oa ON o.idOcorrencia = oa.idOcorrencia
            JOIN aluno a ON oa.Aluno_matricula = a.matricula
            WHERE o.statusOcorrencia = 0
            GROUP BY o.idOcorrencia
        `;
        const conexao = Banco.getConexao();
        const [rows] = await conexao.promise().execute(sql);
        return rows;
    }
    async get_buscarDadosOcorrenciasPendentes() {
        try {
            const dadosBasicos = await this.getDadosBasicosOcorrencias();
            const turmas = await this.getTurmasPorOcorrencia();
            const quantidades = await this.getQuantidadeAlunosPorOcorrencia();
    
            const mapTurmas = new Map(turmas.map(t => [t.idOcorrencia, t.turmas]));
            const mapQuantidades = new Map(quantidades.map(q => [q.idOcorrencia, q.quantidadeAlunos]));
    
            const resultadoFinal = dadosBasicos.map(dado => ({
                idOcorrencia: dado.idOcorrencia,
                relatoFuncionario: dado.relatoFuncionario,
                nomeFuncionario: dado.nomeFuncionario,
                turmas: mapTurmas.get(dado.idOcorrencia) || '',
                quantidadeAlunos: mapQuantidades.get(dado.idOcorrencia) || 0,
                momento: dado.momento
            }));
    
            return resultadoFinal;
        } catch (error) {
            console.error(error);
            return [];
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