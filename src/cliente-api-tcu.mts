export interface IClienteTCU {
	buscarDocumentosResumidos(): Promise<any>;
	pegarDocumento(chave: string): Promise<any>;
}

export type RespostaAPIDocumentosResumidos = {
	quantidadeEncontrada: number,
	inicio: number,
	documentos: [{
		KEY: string,
		TIPO: string,
		TITULO: string,
		NUMACORDAO: string,
		ANOACORDAO: string,
		NUMATA: string,
		COLEGIADO: string,
		DATASESSAO: string,
		PROC: string,
		RELATOR: string,
		SITUACAO: string,
		SUMARIO: string,
		DTATUALIZACAO: string,
	}]
};

export type RespostaAPIDocumentos = {
	quantidadeEncontrada: number,
	inicio: number,
	documentos: [{
		KEY: string,
		TIPO: string,
		TITULO: string,
		NUMACORDAO: string,
		ANOACORDAO: string,
		NUMATA: string,
		ACORDAO: string,
		ASSUNTO: string,
		COLEGIADO: string,
		DATASESSAO: string,
		ENTIDADE: string,
		INTERESSADOS: string,
		PROC: string,
		QUORUM?: string,
		RELATOR: string,
		RELATORIO: string,
		ADVOGADO: string,
		REPRESENTANTEMP?: string,
		SITUACAO: string,
		SUMARIO?: string,
		TIPOPROCESSO: string,
		UNIDADETECNICA: string,
		VOTO?: string,
		DTATUALIZACAO: string,
	}]
};

export class ClienteTCU implements IClienteTCU {
	private readonly URL_BASE = 'https://pesquisa.apps.tcu.gov.br/rest/publico/base/acordao-completo';
	private readonly MENSAGEM_ERRO_RESPONDEU_COM_HTML = `A API do TCU respondeu com HTML em vez de JSON. Provavelmente o limite de acesso foi atingido, e o acesso agora requer um captcha.`;

	async buscarDocumentosResumidos(): Promise<RespostaAPIDocumentosResumidos> {
		const QUANTIDADE = 1000;

		let params = new URLSearchParams({
			termo: 'interstício bolsa',
			ordenacao: 'DTRELEVANCIA asc, NUMACORDAOINT desc',
			filtro: 'TIPOPROCESSO:"TOMADA DE CONTAS ESPECIAL"',
			quantidade: QUANTIDADE.toString(),
		});

		let url = this.URL_BASE + '/documentosResumidos' + '?' + params.toString()

		const resposta = await fetch(url);

		if(resposta.headers.get('content-type') === 'text/html') {
			throw new Error(this.MENSAGEM_ERRO_RESPONDEU_COM_HTML);
		}

		return resposta.json();
	}

	async pegarDocumento(chave: string): Promise<RespostaAPIDocumentos> {
		let params = new URLSearchParams({
			termo: '*',
			filtro: `KEY:${chave}`,
			inicio: '0',
			quantidade: '1',
		});

		let url = this.URL_BASE + '/documento' + '?' + params.toString();

		const resposta = await fetch(url);

		if(resposta.headers.get('content-type') === 'text/html') {
			throw new Error(this.MENSAGEM_ERRO_RESPONDEU_COM_HTML);
		}

		return resposta.json();
	}
}
