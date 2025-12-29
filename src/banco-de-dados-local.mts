import { DatabaseSync, StatementSync } from 'node:sqlite';

/**
 * Modelo da entidade Acordao no banco de dados, contendo os campos advindos das APIs do TCU
 */
export type AcordaoAPI = {
	rapi_chave: string,
	rapi_tipo: string,
	rapi_titulo: string,
	rapi_numero_acordao: string,
	rapi_ano_acordao: string,
	rapi_numero_ata: string,
	rapi_colegiado: string,
	rapi_data_sessao: string,
	rapi_processo: string,
	rapi_relator: string,
	rapi_situacao: string,
	rapi_sumario: string | null,
	rapi_data_atualizacao: string,

	rapi_acordao: string,
	rapi_assunto: string,
	rapi_entidade: string,
	rapi_interessados: string,
	rapi_quorum: string | null,
	rapi_advogado: string,
	rapi_representante_ministerio_publico: string | null,
	rapi_tipo_de_processo: string,
	rapi_unidade_tecnica: string,
	rapi_voto: string | null,
}

export type AcordaoDadosComputados = {
	rapi_chave: string,
	
	comp_numero_acordao: number | null,
	comp_ano_acordao: number | null,
	comp_data_sessao: string | null,
	comp_processo: string | null,
	comp_data_atualizacao: string | null,
	comp_entidade: string | null,
	comp_representante_ministerio_publico: string | null,
	comp_representacao_legal: number | null,
	comp_revelia: number | null,
	comp_resultado: string | null,
}

export type Acordao = AcordaoAPI & AcordaoDadosComputados;

export class BancoDeDadosLocal {
	private caminhoDoArquivo: string;
	private bancoDeDados: DatabaseSync;
	private preparedStatements: {
		lerAcordao: StatementSync;
		letTodosAcordaos: StatementSync;
		insereAcordao: StatementSync;
		atualizaAcordaoComDadosComputados: StatementSync;
	};
	
	constructor(caminhoDoArquivo: string) {
		this.caminhoDoArquivo = caminhoDoArquivo;
	}

	inicializar() {
		this.bancoDeDados = new DatabaseSync(this.caminhoDoArquivo);
		
		/*
		Campos prefixados com `rapi` armazenam os dados diretamente das respostas das APIs.
		Campos prefixados com `comp` são destinados a campos computados a partir dos dados das respostas das APIs.
		*/
		this.bancoDeDados.exec(`
		CREATE TABLE IF NOT EXISTS acordaos (
			rapi_chave TEXT UNIQUE PRIMARY KEY,
			rapi_tipo TEXT NOT NULL,
			rapi_titulo TEXT NOT NULL,
			rapi_numero_acordao TEXT NOT NULL,
			rapi_ano_acordao TEXT NOT NULL,
			rapi_numero_ata TEXT NOT NULL,
			rapi_colegiado TEXT NOT NULL,
			rapi_data_sessao TEXT NOT NULL,
			rapi_processo TEXT NOT NULL,
			rapi_relator TEXT NOT NULL,
			rapi_situacao TEXT NOT NULL,
			rapi_sumario TEXT,
			rapi_data_atualizacao TEXT NOT NULL,

			rapi_acordao TEXT NOT NULL,
			rapi_assunto TEXT,
			rapi_entidade TEXT NOT NULL,
			rapi_interessados TEXT NOT NULL,
			rapi_quorum TEXT,
			rapi_advogado TEXT NOT NULL,
			rapi_representante_ministerio_publico TEXT,
			rapi_tipo_de_processo TEXT NOT NULL,
			rapi_unidade_tecnica TEXT NOT NULL,
			rapi_voto TEXT,

			comp_numero_acordao INTEGER,
			comp_ano_acordao INTEGER,
			comp_data_sessao TEXT,
			comp_processo TEXT,
			comp_data_atualizacao TEXT,
			comp_entidade TEXT,
			comp_representante_ministerio_publico TEXT,
			comp_representacao_legal INTEGER,
			comp_revelia INTEGER,
			comp_resultado TEXT
		)
		`);

		this.preparedStatements = {
			lerAcordao: this.bancoDeDados.prepare('SELECT * FROM acordaos WHERE rapi_chave = ?'),
			letTodosAcordaos: this.bancoDeDados.prepare('SELECT * FROM acordaos'),
			insereAcordao: this.bancoDeDados.prepare(
			`INSERT INTO 
				acordaos(rapi_chave, rapi_tipo, rapi_titulo, rapi_numero_acordao, rapi_ano_acordao, rapi_numero_ata, rapi_colegiado, rapi_data_sessao, rapi_processo, rapi_relator, rapi_situacao, rapi_sumario, rapi_data_atualizacao, rapi_acordao, rapi_assunto, rapi_entidade, rapi_interessados, rapi_quorum, rapi_advogado, rapi_representante_ministerio_publico, rapi_tipo_de_processo, rapi_unidade_tecnica, rapi_voto) 
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
			),
			atualizaAcordaoComDadosComputados: this.bancoDeDados.prepare(
				`UPDATE acordaos
					SET
						comp_numero_acordao = :comp_numero_acordao,
						comp_ano_acordao = :comp_ano_acordao,
						comp_data_sessao = :comp_data_sessao,
						comp_processo = :comp_processo,
						comp_data_atualizacao = :comp_data_atualizacao,
						comp_entidade = :comp_entidade,
						comp_representante_ministerio_publico = :comp_representante_ministerio_publico,
						comp_representacao_legal = :comp_representacao_legal,
						comp_revelia = :comp_revelia,
						comp_resultado = :comp_resultado
					WHERE
						rapi_chave = :rapi_chave
				`
			),
		}
	}

	lerAcordao(chave: string): Acordao {
		// TODO: revisar tipo de dados, está funcionando por que apenas chave é utilizado
		const respostaDaLeitura = this.preparedStatements.lerAcordao.get(chave);

		return respostaDaLeitura as unknown as Acordao;
	}

	lerTodosAcordaos(): Acordao[] {
		const respostaDaLeitura = this.preparedStatements.letTodosAcordaos.all();

		return respostaDaLeitura as unknown as Acordao[];
	}

	insereAcordao(acordao: AcordaoAPI): void {
		this.preparedStatements.insereAcordao.run(
			acordao.rapi_chave,
			acordao.rapi_tipo,
			acordao.rapi_titulo,
			acordao.rapi_numero_acordao,
			acordao.rapi_ano_acordao,
			acordao.rapi_numero_ata,
			acordao.rapi_colegiado,
			acordao.rapi_data_sessao,
			acordao.rapi_processo,
			acordao.rapi_relator,
			acordao.rapi_situacao,
			acordao.rapi_sumario,
			acordao.rapi_data_atualizacao,
			acordao.rapi_acordao,
			acordao.rapi_assunto,
			acordao.rapi_entidade,
			acordao.rapi_interessados,
			acordao.rapi_quorum,
			acordao.rapi_advogado,
			acordao.rapi_representante_ministerio_publico,
			acordao.rapi_tipo_de_processo,
			acordao.rapi_unidade_tecnica,
			acordao.rapi_voto
		);
	}

	atualizaAcordaoComDadosComputados(acordao: AcordaoDadosComputados): void {
		
		this.preparedStatements.atualizaAcordaoComDadosComputados.run(
			acordao
		);
	}
}