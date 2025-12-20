# Pesquisa

Este documento contém notas de pesquisa das APIs do Tribunal de Contas da União (TCU) e quaisquer outros aspectos técnicos necessários para monitorar, agregar e avaliar processos no TCU referentes ao não cumprimento da obrigação do interstício, no contexto de termos de compromisso de bolsas para formação e trabalho no exterior.

## APIs do TCU

Seção em construção.

## Histórico da pesquisa

### 2025-12-19

Guilherme Dellagustin:

Baseado em experiências anteriores, realizei pesquisas no site https://pesquisa.apps.tcu.gov.br/ pelos termos "interstício bolsa", e usei as ferramentas de desenvolvimento do browser para monitorar e inspecionar _HTTP resquests_.

A "decodificação" de URLs foi feita com o/no site <https://www.urldecoder.org/>.

Desta forma, encontrei os seguintes _requests_:

| _Request_ | Notas |
|----------|--------|
| https://pesquisa.apps.tcu.gov.br/rest/publico/base/acordao-completo/documentosResumidos?termo=interst%C3%ADcio%20bolsa&ordenacao=DTRELEVANCIA%20desc,%20NUMACORDAOINT%20desc&quantidade=20& (decodificada: `https://pesquisa.apps.tcu.gov.br/rest/publico/base/acordao-completo/documentosResumidos?termo=interstício bolsa&ordenacao=DTRELEVANCIA desc, NUMACORDAOINT desc&quantidade=20&`) | Utilizado pela página que mostra resultados de busca. Responde com uma estrutura de dados em formato JSON, contendo uma tabela com os resultados de busca. Contém informações chave como: informações de paginação (`quantidadeEncontrada`, `inicio`), informações agregadas (`facetas.campos`), informações de acórdãos (`KEY`, `TIPO`, `RELATOR`, `SUMARIO`). Em especial esta API já traz dados agregados de ítems (acórdãos, acórdãos de relação, etc...) por ano (`facetas.campos`). Resposta na qual me baseei: [2025-12-20-pesquisa.apps.tcu.gov.br-rest-publico-base-acordao-completo-documentosResumidos-1.json](api-exemplos-de-respostas/2025-12-20-pesquisa.apps.tcu.gov.br-rest-publico-base-acordao-completo-documentosResumidos-1.json)|
| https://pesquisa.apps.tcu.gov.br/rest/publico/base/acordao-completo/documento?termo=*&filtro=KEY%3AACORDAO-COMPLETO-2730582&ordenacao=DTRELEVANCIA%20desc,%20NUMACORDAOINT%20desc&quantidade=1&inicio=0& (decodificada: `https://pesquisa.apps.tcu.gov.br/rest/publico/base/acordao-completo/documento?termo=*&filtro=KEY:ACORDAO-COMPLETO-2730582&ordenacao=DTRELEVANCIA desc, NUMACORDAOINT desc&quantidade=1&inicio=0&`) | Utilizado na página que mostra um acórdão específico, contém informações adicionais, como representante do MPTCU, entidade (e.g., CNPq) e textos do relatório e voto. |

Notei que apesar das APIs terem um "query parameter" `ordenacao=DTRELEVANCIA%20desc,%20NUMACORDAOINT%20desc`, (decodificada: `ordenacao=DTRELEVANCIA desc, NUMACORDAOINT desc`), os resultados parecem ser mostrados em ordem decrescente do número do acórdão.

Em testes realizados com a API <https://pesquisa.apps.tcu.gov.br/rest/publico/base/acordao-completo/documentosResumidos>, observei que é possível indicar valores mais altos no parâmetro `quantidade`. Em um teste com o valor `10000`, parece ser sido possível obter todos os acórdãos (informações resumidas), em uma única chamada, eliminando a necessidade de se implementar uma rotina de consulta páginada, pelo menos em uma versão inicial.

Para o monitoramento de novos acórdãos, e acórdãos atualizados, talvez seja possível utilizar o parâmetro `filtro` e a propriedade `DTATUALIZACAO`, para periódimante buscar por arcórdãos atualizadoes desde a última busca.

No futuro, pretendo testar se a API <https://pesquisa.apps.tcu.gov.br/rest/publico/base/acordao-completo/documento> pode ser utilizada para obter informações de múltiplos acordãos com apenas uma chamada. Os "query parameters" indicam que isso talvez seja possível, de forma a reduzir o número de chamadas.

Com essas duas APIs, acredito que é possível realizer uma varredura e criar uma banco de dados completo dos acórdãos que contém os termos arbitrários (como "interstício bolsa"), bem como criar uma ferramenta de monitoramento e alerta de novos acórsãos e manutenção do banco de dados especializado.