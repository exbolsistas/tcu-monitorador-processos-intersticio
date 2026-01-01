# Pesquisa e Desenvolvimento

Este documento contém notas de pesquisa das APIs do Tribunal de Contas da União (TCU) e quaisquer outros aspectos técnicos necessários para monitorar, agregar e avaliar processos no TCU referentes ao não cumprimento da obrigação do interstício, no contexto de termos de compromisso de bolsas para formação e trabalho no exterior. Contém também notas de desenvolvimento e uso das ferramentas.

## APIs do TCU

Seção em construção.

## Referências

- https://sites.tcu.gov.br/dados-abertos/webservices-tcu/#consultar-acordaos

## Histórico da pesquisa e desenvolvimento

### 2025-12-29

Guilherme Dellagustin:

Descobri hoje que no site <https://pesquisa.apps.tcu.gov.br/> também é possível pesquisar por processos (<https://pesquisa.apps.tcu.gov.br/pesquisa/processo>). As APIs por trás dessa busca e da página que mostra informações de processos ainda precisa ser explorada.

https://pesquisa.apps.tcu.gov.br/rest/publico/base/processo/documento?termo=bolsa%20exterior&filtro=TIPO%3A%22Tomada%20de%20Contas%20Especial%22%20DTATUALIZACAO%3A%5B20250701%20to%2020251231%5D&ordenacao=DTAUTUACAOORDENACAO%20desc,%20NUMEROCOMZEROS%20desc&quantidade=1&inicio=0&
Request Method


### 2025-12-27

Guilherme Dellagustin:

Primeira versão funcional em testes.

Fatos relevantes encontrados nos testes:

- Mesmo na resposta da API `documento`, os campos `QUORUM`, `ASSUNTO`, `REPRESENTANTEMP`, `SUMARIO` e `VOTO` podem ser omitidos da resposta, dependendo do tipo de acórdão e outros fatores
- Após alguns testes, as URLs das APIs passaram a responder com uma página HTML de captcha. Aparentemente, é feito o uso de cookies para guardar o resultado de captchas, o que garante o acesso à API em um próximo acesso. Não pensei ainda em como resolver esse problema, mas pode ser um problema complicado
- Nem todos os acórdãos incluídos na busca por "_interstício bolsa_" são referentes a bolsas de pós-graduação (e.g., `ACORDAO-COMPLETO-2692214`, `ACORDAO-COMPLETO-2674738`)

Descobri também, fazendo mais testes na interface de usuário da busca do TCU, que é possível utilizar outros filtros, como na URL:
`https://pesquisa.apps.tcu.gov.br/rest/publico/base/acordao-completo/documentosResumidos?termo=interstício bolsa&filtro=TIPOPROCESSO:"TOMADA DE CONTAS ESPECIAL" DTRELEVANCIA:[20251101 to 20251231] COPIATIPO:("ACÓRDÃO")&ordenacao=DTRELEVANCIA desc, NUMACORDAOINT desc&quantidade=20&inicio=0`

Dessa forma, podemos já filtrar por tipo de processo (_Tomada de Contas Especial_) e também por datas de seção, para obter apenas novos acórdãos.

Testes ainda são necessários para verificar se é possível também pegar acórdãos atualizados a partir de uma certa data, filtrando pelo campo `DTATUALIZACAO`

Notei que os campos do filtro não diferentes do campo que temos na resposta, por exemplo, `DTRELEVANCIA` corresponde à data da seção, que na resposta é representada pelo campo `DATASESSAO`.

Uma vez que a [Linguagem de definição de dados](https://pt.wikipedia.org/wiki/Linguagem_de_defini%C3%A7%C3%A3o_de_dados) de SQLite não comporta a funcionalidade de `ALTER COLUMN` (consulte <https://sqlite.org/lang_altertable.html>), não pude alterar alguns dos campos de `TEXT NOT NULL` para `TEXT` de forma fácil, então modifiquei o código para armazenar uma _string_ vazia (`""`) nesses casos. Isso já foi alterado para novas execuções, em que op banco foi alterado para permitir campos `NULL`, para os campos que não estão sempre presentes nas respostas da API `documento`.

Após conseguir criar um banco de dados "completo", nesta primeira versão, usei a ferramenta DBeaver para exportar os resultados em formato CSV e realizar algumas análises. Em primeiras tentativas, ao importar o arquivo CSV no excel, macOS, caracteres como `Ó` eram importados incorretamene. Em pesquisa, descobri que o excel (do macOS?) requer que arquivos texto com _encoding_ UTF-8 rquerem um _Byte order mark_ (BOM, <https://pt.wikipedia.org/wiki/Marca_de_ordem_de_byte>). O DBeaver tem essa opção. Descobri também que o arquivo CSV resultante muitas vezes continha linhas de texto que pareciam vir de campos como `ACORDAO`. Exportei o arquivo novamente excluindo algumas colunas que tinham valores extensos em texto, o que resolveu o problema.

Dessa forma, pude importar arquivo CSV no excel e realizar algumas análises básicas.

### 2025-12-25

Guilherme Dellagustin:

Comecei a pesquisar sobre como criar um banco de dados em SQLite com uma aplicação em nodejs.
Inicialmente planejava escrever em python, mas como tenho mais familiaridade com Javascript, TypeScript e o ecossistema nodejs, optei por esse caminho.

Sem muito critério, comecei a desenvolver a aplicação com base na API nativa para SQLite do nodejs:

- <https://betterstack.com/community/guides/scaling-nodejs/nodejs-sqlite/#building-a-book-inventory-application>
- <https://www.javascripttutorial.net/nodejs-tutorial/nodejs-sqlite/>
- <https://nodejs.org/api/sqlite.html>

Outra alternative seria usar o módulo `sqlite3`, mas por qualquer razão, preferi testar a API nativa.

### 2025-12-24

Guilherme Dellagustin:

Realizei os testes descritos abaixo:

#### API `documentosResumidos`

Tentei incluir o parâmtro `filtro` com o campo `DTATUALIZACAO` para pegar documentos atualizados mais recentemente que uma data arbitrária, mas a sintaxe observada na API `documento` é apenas para filtrar valores iguais. Experimentei com `DTATUALIZACAO > 20250101`, `DTATUALIZACAO gt 20250101` e `DTATUALIZACAO:>20250101` sem sucesso.

#### API `documento`

Tentei manipular os parâmetros `termo` e `quantidade` para pegar vários documentos completos em uma só chamada, mas não tive sucesso. A API sempre respondeu com apenas um documento.

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