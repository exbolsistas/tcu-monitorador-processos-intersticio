import { AcordaoAPI, BancoDeDadosLocal } from "./banco-de-dados-local.mjs";
import { ClienteTCU } from "./cliente-api-tcu.mjs";

async function main () {
	try {
		console.log('Inicializando banco de dados...');
		const bancoDeDadosLocal = new BancoDeDadosLocal('acordaos-tcu-intersticio.db');
		bancoDeDadosLocal.inicializar();
		console.log('Banco de dados inicializado com sucesso.')

		const cliente = new ClienteTCU();
		console.log('Iniciando busca de acórdãos resumidos...')
		const respostaAPIDocumentosResumidos = await cliente.buscarDocumentosResumidos();

		console.log(`Busca de acórdãos resumidos concluída com sucesso. Encontrados ${respostaAPIDocumentosResumidos.quantidadeEncontrada} acórdãos`);

		for(let i = 0; i < respostaAPIDocumentosResumidos.documentos.length; i++) {
			const documentoResumido = respostaAPIDocumentosResumidos.documentos[i];

			const acordao = bancoDeDadosLocal.lerAcordao(documentoResumido.KEY);

			if(!acordao) {
				console.log(`Acórdão ${documentoResumido.KEY} (${i+1}/${respostaAPIDocumentosResumidos.documentos.length}) ainda não está no banco de dados. Iniciando busca pelo documento completo.`);

				const respostaAPIDocumento = await cliente.pegarDocumento(documentoResumido.KEY);
				const documento = respostaAPIDocumento.documentos[0];

				// Passar `null` em vez de `undefined` (por isso `|| null` em campos de texto) provê melhores mensagens de erro para campos `TEXT NOT NULL`
				// no banco de dados, e também é necessário mesmo para campos que aceitam NULL, pois a rotina que escreve no banco de dados não aceita
				// `undefined` como se fosse `null`.
				const acordaoNovo: AcordaoAPI = {
					rapi_chave: documento.KEY || null,
					rapi_tipo: documento.TIPO || null,
					rapi_titulo: documento.TITULO || null,
					rapi_numero_acordao: documento.NUMACORDAO || null,
					rapi_ano_acordao: documento.ANOACORDAO || null,
					rapi_numero_ata: documento.NUMATA || null,
					rapi_colegiado: documento.COLEGIADO || null,
					rapi_data_sessao: documento.DATASESSAO || null,
					// O campo PROC em documento é mais "sujo" e contém um link html, em vez de apenas o número do processo
					rapi_processo: documentoResumido.PROC || null,
					rapi_relator: documentoResumido.RELATOR || null,
					rapi_situacao: documento.SITUACAO || null,
					rapi_sumario: documento.SUMARIO || null,
					rapi_data_atualizacao: documento.DTATUALIZACAO || null,
					rapi_acordao: documento.ACORDAO || null,
					rapi_assunto: documento.ASSUNTO || null,
					rapi_entidade: documento.ENTIDADE || null,
					rapi_interessados: documento.INTERESSADOS || null,
					rapi_quorum: documento.QUORUM || null,
					rapi_advogado: documento.ADVOGADO || null,
					rapi_representante_ministerio_publico: documento.REPRESENTANTEMP || null,
					rapi_tipo_de_processo: documento.TIPOPROCESSO || null,
					rapi_unidade_tecnica: documento.UNIDADETECNICA || null,
					rapi_voto: documento.VOTO || null
				}

				bancoDeDadosLocal.insereAcordao(acordaoNovo);

				console.log(`Acórdão ${documentoResumido.KEY} (${i+1}/${respostaAPIDocumentosResumidos.documentos.length}) adicionado ao banco de dados.`);
			}
		}
	}
	catch (e)
	{
		console.log(e);
		process.exit(1);
	}
}

main();
