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
    async get_buscarDadosOcorrenciasPendentes() {
        const sql = `
            SELECT  
                o.idOcorrencia,                                      -- ID da ocorrência
                o.relatoFuncionario,                                 -- Relato do professor sobre a ocorrência
                f.nome AS nomeFuncionario,                           -- Nome do professor (funcionário) responsável

                GROUP_CONCAT(DISTINCT a.turma ORDER BY a.turma SEPARATOR ', ') AS turmas,
                -- Agrupa todas as turmas dos alunos envolvidos na ocorrência, separadas por vírgula, sem repetições

                COUNT(DISTINCT a.matricula) AS quantidadeAlunos
                -- Conta quantos alunos diferentes estão associados a essa ocorrência

            FROM ocorrencia o
            JOIN funcionario f ON o.Funcionario_registro_Professor = f.registro
            -- Junta com a tabela de funcionários para obter os dados do professor responsável

            JOIN ocorrencia_aluno oa ON o.idOcorrencia = oa.idOcorrencia
            -- Junta com a tabela de associação entre ocorrências e alunos

            JOIN aluno a ON oa.Aluno_matricula = a.matricula
            -- Junta com a tabela de alunos para acessar informações como a turma e matrícula

            WHERE o.statusOcorrencia = 0
            -- Considera apenas ocorrências com status 0 (ativas/não resolvidas)

            GROUP BY o.idOcorrencia, o.relatoFuncionario, f.nome
            -- Agrupa os dados por ocorrência e professor para usar agregações como COUNT e GROUP_CONCAT

            ORDER BY o.momento ASC
            -- Ordena as ocorrências da mais antiga para a mais recente
        `;

        try {
            const conexao = Banco.getConexao();
            const [rows] = await conexao.promise().execute(sql); 
            rows.forEach(row => console.log("Relato:", row.relatoFuncionario));
            return rows;
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