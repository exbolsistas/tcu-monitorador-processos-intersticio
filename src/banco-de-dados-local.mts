import { DatabaseSync, StatementSync } from 'node:sqlite';

export type Acordao = {
	chave: string,
	tipo: string,
	titulo: string,
	numeroAcordao: number,
	anoAcordao: number,
	numeroAta: string,
	colegiado: string,
	dataSessao: number,
	processo: string,
	relator: string,
	situacao: string,
	sumario: string | null,
	dataAtualizacao: number,

	acordao: string,
	assunto: string,
	entidate: string,
	interessados: string,
	quorum: string | null,
	advogado: string,
	representateMiniterioPublico: string,
	tipoDeProcesso: string,
	unidadeTecnica: string,
	voto: string | null,
}

export class BancoDeDadosLocal {
	private caminhoDoArquivo: string;
	private bancoDeDados: DatabaseSync;
	private preparedStatements: {
		lerAcordao: StatementSync;
		insereAcordao: StatementSync;
	};
	
	constructor(caminhoDoArquivo: string) {
		this.caminhoDoArquivo = caminhoDoArquivo;
	}

	inicializar() {
		this.bancoDeDados = new DatabaseSync(this.caminhoDoArquivo);
		this.bancoDeDados.exec(`
		CREATE TABLE IF NOT EXISTS acordaos (
			chave TEXT UNIQUE PRIMARY KEY,
			tipo TEXT NOT NULL,
			titulo TEXT NOT NULL,
			numero_acordao INTEGER,
			ano_acordao INTEGER,
			numero_ata TEXT NOT NULL,
			colegiado TEXT NOT NULL,
			data_sessao INTEGER,
			processo TEXT NOT NULL,
			relator TEXT NOT NULL,
			situacao TEXT NOT NULL,
			sumario TEXT,
			data_atualizacao INTEGER,

			acordao TEXT NOT NULL,
			assunto TEXT,
			entidate TEXT NOT NULL,
			interessados TEXT NOT NULL,
			quorum TEXT,
			advogado TEXT NOT NULL,
			representate_miniterio_publico TEXT,
			tipo_de_processo TEXT NOT NULL,
			unidade_tecnica TEXT NOT NULL,
			voto TEXT
		)
		`);

		this.preparedStatements = {
			lerAcordao: this.bancoDeDados.prepare('SELECT * FROM acordaos WHERE chave = ?'),
			insereAcordao: this.bancoDeDados.prepare(
			`INSERT INTO 
				acordaos(chave, tipo, titulo, numero_acordao, ano_acordao, numero_ata, colegiado, data_sessao, processo, relator, situacao, sumario, data_atualizacao, acordao, assunto, entidate, interessados, quorum, advogado, representate_miniterio_publico, tipo_de_processo, unidade_tecnica, voto) 
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
			)
		}

		/* this.preparedStatements.atualizarAcordao = this.bancoDeDados.prepare(
			`INSERT INTO acordaos(chave, tipo, titulo, numero_acordao, datasecao, relator, data_atualizacao) FROM acordaos 
				WHERE chave = ?`) */
	}

	insereAcordao(acordao: Acordao): void {
		this.preparedStatements.insereAcordao.run(
			acordao.chave,
			acordao.tipo,
			acordao.titulo,
			acordao.numeroAcordao,
			acordao.anoAcordao,
			acordao.numeroAta,
			acordao.colegiado,
			acordao.dataSessao,
			acordao.processo,
			acordao.relator,
			acordao.situacao,
			acordao.sumario,
			acordao.dataAtualizacao,
			acordao.acordao,
			acordao.assunto,
			acordao.entidate,
			acordao.interessados,
			acordao.quorum,
			acordao.advogado,
			acordao.representateMiniterioPublico,
			acordao.tipoDeProcesso,
			acordao.unidadeTecnica,
			acordao.voto
		);
	}

	lerAcordao(chave: string): Acordao {
		return this.preparedStatements.lerAcordao.get(chave) as Acordao;
	}
}