import { Acordao, BancoDeDadosLocal } from "./banco-de-dados-local.mjs";
import { ClienteTCU, RespostaAPIDocumentos } from "./cliente-api-tcu.mjs";

async function main () {
	try {
		const cliente = new ClienteTCU();

		console.log('Iniciando busca de acórdãos resumidos...')
		const respostaAPIDocumentosResumidos = await cliente.buscarDocumentosResumidos();

		console.log(`Busca de acórdãos resumidos concluída com sucesso. Encontrados ${respostaAPIDocumentosResumidos.quantidadeEncontrada} acórdãos`);

		const bancoDeDadosLocal = new BancoDeDadosLocal('acordaos-tcu-intersticio.db');
		bancoDeDadosLocal.inicializar();

		for(let i = 0; i < respostaAPIDocumentosResumidos.documentos.length; i++) {
			const documentoResumido = respostaAPIDocumentosResumidos.documentos[i];

			const acordao = bancoDeDadosLocal.lerAcordao(documentoResumido.KEY);

			if(!acordao) {
				console.log(`Acórdão ${documentoResumido.KEY} (${i+1}/${respostaAPIDocumentosResumidos.documentos.length}) ainda não está no banco de dados. Iniciando busca pelo documento completo.`);

				const respostaAPIDocumento = await cliente.pegarDocumento(documentoResumido.KEY);
				const documento = respostaAPIDocumento.documentos[0];

				// Passar `null` em vez de `undefined` (por isso `|| null` em campos de texto) provê melhores mensagens de erro para campos `TEXT NOT NULL`
				// no banco de dados, e também é necessário mesmo para campos que aceitam NULL.
				const acordaoNovo: Acordao = {
					chave: documento.KEY || null,
					tipo: documento.TIPO || null,
					titulo: documento.TITULO || null,
					numeroAcordao: parseInt(documento.NUMACORDAO) || null,
					anoAcordao: parseInt(documento.ANOACORDAO) || null,
					numeroAta: documento.NUMATA || null,
					colegiado: documento.COLEGIADO || null,
					dataSessao: converteDATASESSAO(documento.DATASESSAO),
					// O campo PROC em documento é mais "sujo" e contém um link html, em vez de apenas o número do processo
					processo: documentoResumido.PROC || null,
					relator: documentoResumido.RELATOR || null,
					situacao: documento.SITUACAO || null,
					sumario: documento.SUMARIO || null,
					dataAtualizacao: converteDTATUALIZACAO(documento.DTATUALIZACAO),
					// TODO remover || ""
					acordao: documento.ACORDAO || "", // || null,
					// TODO remover || ""
					assunto: documento.ASSUNTO || "", // || null,
					entidate: documento.ENTIDADE || null,
					interessados: documento.INTERESSADOS || null,
					quorum: documento.QUORUM || null,
					// TODO remover || ""
					advogado: documento.ADVOGADO || "", // || null,
					representateMiniterioPublico: documento.REPRESENTANTEMP || null,
					tipoDeProcesso: documento.TIPOPROCESSO || null,
					// TODO remover || ""
					unidadeTecnica: documento.UNIDADETECNICA  || "", // || null,
					voto: documento.VOTO || null
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

/**
 * 
 * @param valorDATASESSAO Data em formato de texto (string) no formato "dd-mm-aaaa"
 * @returns 
 */
function converteDATASESSAO(valorDATASESSAO: string): number {
	return Date.parse(
		valorDATASESSAO.substring(6, 10) + '-' +
		valorDATASESSAO.substring(3, 5) + '-' +
		valorDATASESSAO.substring(0, 2)
	);
}

/**
 * 
 * @param valorDTATUALIZACAO Data em formato de texto (string) no formato "aaaammdd"
 * @returns 
 */
function converteDTATUALIZACAO(valorDTATUALIZACAO: string): number {
	return Date.parse(
		valorDTATUALIZACAO.substring(0, 4) + '-' +
		valorDTATUALIZACAO.substring(4, 6) + '-' +
		valorDTATUALIZACAO.substring(6, 8)
	);
}

main();
