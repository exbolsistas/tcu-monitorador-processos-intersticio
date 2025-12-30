import { Acordao, AcordaoDadosComputados, BancoDeDadosLocal } from "./banco-de-dados-local.mjs";

function computaDadosDeAcordaos() {
	console.log('Inicializando banco de dados...');
	const bancoDeDadosLocal = new BancoDeDadosLocal('acordaos-tcu-intersticio.db');
	bancoDeDadosLocal.inicializar();
	console.log('Banco de dados inicializado com sucesso.')

	const acordaos = bancoDeDadosLocal.lerTodosAcordaos();

	for(let i = 0; i < acordaos.length; i ++) {
		const acordao = acordaos[i];

		// TODO: computar número do processo formatado

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
			comp_resultado: computaResultado(acordao),
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

function computaResultado(acordao: Acordao): string {
	const sumario_lowercase = acordao.rapi_sumario?.toLowerCase();
	const acordao_lowercase = acordao.rapi_acordao?.toLowerCase();

	const PRESCRICAO_ARQUIVAMENTO = "Prescrição, Arquivamento";
	const SOBRESTAMENTO = "Sobrestamento";
	const NOVACAO_SOBRESTAMENTO = "Novação, Sobrestamento";
	const NOVACAO_ARQUIVAMENTO = "Novação, Arquivamento";
	const CONTAS_IRREGULARES = "Contas Irregulares, Débito";
	const CONTAS_REGULARES = "Contas Regulares, Quitação";

	if(sumario_lowercase) {
		if(sumario_lowercase.search('prescrição') >= 0 && sumario_lowercase.search('arquivamento') >= 0) {
			return PRESCRICAO_ARQUIVAMENTO;
		}

		if(sumario_lowercase.search('sobrestamento') >= 0) {
			return SOBRESTAMENTO;
		}

		if((sumario_lowercase.search('irregularidade das contas') >= 0 || sumario_lowercase.search('contas irregulares') >= 0) 
			&& sumario_lowercase.search('débito') >= 0) {
			return CONTAS_IRREGULARES;
		}

		if(sumario_lowercase.search('ressalva') >= 0 ) {
			return CONTAS_REGULARES;
		}
	}
	else if (acordao_lowercase) {
		// provavelmente é um Acórdão de Relação. Por observação, estes não tem sumário.

		// há um caso em que houve prescrição, porém a possibilidade de julgament ode regularidade das contas deve ter precedência em relação a prescrição
		// consulte https://pesquisa.apps.tcu.gov.br/redireciona/acordao-completo/ACORDAO-COMPLETO-2575409 (ACÓRDÃO DE RELAÇÃO 2598/2023 - PRIMEIRA CÂMARA)
		if(acordao_lowercase.search('ressalva') >= 0 ) {
			return CONTAS_REGULARES;
		}

		if(acordao_lowercase.search('prescrição') >= 0 
			&& (acordao_lowercase.search('arquivar') >= 0 || acordao_lowercase.search('arquivamento') >= 0)) {
			return PRESCRICAO_ARQUIVAMENTO;
		}

		// Processo sobrestado devido a termo de novação assinado
		// - (Termo de Novação, sobrestar) https://pesquisa.apps.tcu.gov.br/redireciona/acordao-completo/ACORDAO-COMPLETO-2709213
		if(acordao_lowercase.search('termo de novação') >= 0 && acordao_lowercase.search('sobrestar') >= 0) {
			return NOVACAO_SOBRESTAMENTO;
		}

		// arquivado devido à novação aprovada, sem o uso do termo sobrestar, sobrestamento, etc...
		// - (Termo de Novação, arquivar) https://pesquisa.apps.tcu.gov.br/redireciona/acordao-completo/ACORDAO-COMPLETO-2726165
		// - (Termo de Novação, arquivar) https://pesquisa.apps.tcu.gov.br/redireciona/acordao-completo/ACORDAO-COMPLETO-2724943
		// - (Termo de Novação, arquivar) https://pesquisa.apps.tcu.gov.br/redireciona/acordao-completo/ACORDAO-COMPLETO-2729927
		// - (Termo de Novação, arquivamento) https://pesquisa.apps.tcu.gov.br/redireciona/acordao-completo/ACORDAO-COMPLETO-2731359
		// - (Termo de Outorga, arquivar, arquivamento) https://pesquisa.apps.tcu.gov.br/redireciona/acordao-completo/ACORDAO-COMPLETO-2728983
		if((acordao_lowercase.search('termo de novação') >= 0 || acordao_lowercase.search('termo de outorga') >= 0)
			&& (acordao_lowercase.search('arquivar') >= 0 || acordao_lowercase.search('arquivamento') >= 0)) {
			return NOVACAO_ARQUIVAMENTO;
		}

		// Casos não contemplados:
		// 1. novo prazo para apresentar proposta de novação
		//    - https://pesquisa.apps.tcu.gov.br/redireciona/acordao-completo/ACORDAO-COMPLETO-2711778
		// 2. arquivamento devido ao pagamento do débito 
		//    - https://pesquisa.apps.tcu.gov.br/redireciona/acordao-completo/ACORDAO-COMPLETO-2658989
		// consessão de novo prazo para pagamento 
		//    - https://pesquisa.apps.tcu.gov.br/redireciona/acordao-completo/ACORDAO-COMPLETO-2667106
	}

	return "Outro";
}

computaDadosDeAcordaos();
