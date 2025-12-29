import { Acordao, AcordaoDadosComputados, BancoDeDadosLocal } from "./banco-de-dados-local.mjs";

function computaDadosDeAcordaos() {
	console.log('Inicializando banco de dados...');
	const bancoDeDadosLocal = new BancoDeDadosLocal('acordaos-tcu-intersticio.db');
	bancoDeDadosLocal.inicializar();
	console.log('Banco de dados inicializado com sucesso.')

	const acordaos = bancoDeDadosLocal.lerTodosAcordaos();

	for(let i = 0; i < acordaos.length; i ++) {
		const acordao = acordaos[i];

		// TODO: computar número do processo formatado e resultado

		const acordaoDadosComputatos: AcordaoDadosComputados = {
			rapi_chave: acordao.rapi_chave,
			comp_numero_acordao: parseInt(acordao.rapi_numero_acordao),
			comp_ano_acordao: parseInt(acordao.rapi_ano_acordao),
			comp_data_sessao: computaDataSessao(acordao.rapi_data_sessao),
			comp_processo: "",
			comp_data_atualizacao: computaDataAtualizacao(acordao.rapi_data_atualizacao),
			comp_entidade: computaEntidade(acordao.rapi_entidade),
			comp_representante_ministerio_publico: computaRepresentanteMinisterioPublico(acordao.rapi_representante_ministerio_publico),
			comp_representacao_legal: computaRepresentacaoLegal(acordao.rapi_advogado),
			comp_revelia: computaRevelia(acordao),
			comp_resultado: ""
		}
		
		bancoDeDadosLocal.atualizaAcordaoComDadosComputados(acordaoDadosComputatos);
	}

	console.log('Dados computados com sucesso.');
}

/**
 * 
 * @param rapiDataSessao Data em formato de texto (string) no formato "dd/mm/aaaa"
 * @returns Data em formato de texto (string) no formato "aaaa-mm-dd"
 */
function computaDataSessao(rapiDataSessao: string): string {
	return (
		rapiDataSessao.substring(6, 10) + '-' +
		rapiDataSessao.substring(3, 5) + '-' +
		rapiDataSessao.substring(0, 2)
	);
}

/**
 * 
 * @param rapiDataAtualizacao Data em formato de texto (string) no formato "aaaammdd"
 * @returns Data em formato de texto (string) no formato "aaaa-mm-dd"
 */
function computaDataAtualizacao(rapiDataAtualizacao: string): string {
	return (
		rapiDataAtualizacao.substring(0, 4) + '-' +
		rapiDataAtualizacao.substring(4, 6) + '-' +
		rapiDataAtualizacao.substring(6, 8)
	);
}

function computaEntidade(rapiEntidade: string) {
	if(rapiEntidade.search('Conselho Nacional de Desenvolvimento Científico e Tecnológico') >= 0) {
		return 'Conselho Nacional de Desenvolvimento Científico e Tecnológico'
	}
	else if (rapiEntidade.search('Fundação Coordenação de Aperfeiçoamento de Pessoal de Nível Superior') >= 0) {
		return 'Fundação Coordenação de Aperfeiçoamento de Pessoal de Nível Superior'
	}
	else {
		return rapiEntidade;
	}
}

function computaRepresentacaoLegal(rapiAdvogado: string): number {
	return rapiAdvogado.toLocaleLowerCase().search('não há') >= 1 ? 0 : 1;
}

function computaRevelia(acordao: Acordao): number {
	return acordao.rapi_sumario && acordao.rapi_sumario.toLocaleLowerCase().search('revelia') >= 0 ? 1 : 0;
}

function computaRepresentanteMinisterioPublico(rapiRepresentanteMinisterioPublico: string ): string {
	if(rapiRepresentanteMinisterioPublico && rapiRepresentanteMinisterioPublico[rapiRepresentanteMinisterioPublico.length-1] == '.') {
		return rapiRepresentanteMinisterioPublico.substring(0, rapiRepresentanteMinisterioPublico.length - 1);
	}
	else 
	{
		return rapiRepresentanteMinisterioPublico || "";
	}
}

computaDadosDeAcordaos();
