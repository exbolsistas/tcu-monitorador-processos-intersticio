# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Mantenha um Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto usa [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Modificado

- Modificada a mensagem de error que ocorre quando a API retorna com uma página HTML em vez de um arquivo JSON.

### Corrigido

- Corrigido erro na rotina que detecta quando a API retorna uma página HTML em vez de um arquivo JSON.

## [0.2.0] - 2025-12-30

### Adicionado

- Script que computa dados a partir das respostas das APIs foi atualizado para computar o resultado do acórdão, baseado em palavras chave encontratas nos campos `SUMARIO` e `ACORDAO` (no banco, `rapi_sumario` e `rapi_acordao`). Os possíveis resultados são:
    - `Prescrição, Arquivamento`
    - `Sobrestamento`
    - `Novação, Sobrestamento`
    - `Novação, Arquivamento`
    - `Contas Irregulares, Débito`
    - `Contas Regulares, Quitação`
    - `Outro`

## [0.1.0] - 2025-12-29

### Adicionado

- Script que atualiza dados computados no banco de dados. Dados computados: 
    - _número do acórdão_ em tipo `INTEGER`,
    - _ano do acórdão_ em tipo `INTEGER`,
    - _data da sessão_ em tipo `STRING`, formato `aaaa-mm-dd`,
    - _data de atualização_ em tipo `STRING`, formato `aaaa-mm-dd`,
    - _representante do ministério público_ em tipo `STRING`, removendo pontos finais
    - _entidade_ em tipo `STRING`, normalizando as diferentes maneiras de representar a entidade _Conselho Nacional de Desenvolvimento Científico e Tecnológico_ (CNPq)
    - _representante do ministério público_ em tipo `STRING`, sem ponto final (`.`), caso haja, para normalizar a representação do valor no campo (uma vez que os nomes de representantes eram hora representados com ponto final, hora sem),
    - _representação legal_ em tipo `INTEGER`, contendo indicador booleano, caso haja representação legal,
    - _revelia_ em tipo `INTEGER`, contendo indicador booleano, caso seja computado que o acórdão foi julgado à revelia

### Modificado

- Modificada a estrutura do banco de dados. A estrutura agora comporta as respostas da API sem nenhum tipo de processamento adicional e também campos computados a partir dos dados das respostas da API

## [0.0.1] - 2025-12-27

Esta é a primeira versão usável de uma ferramenta (pacote NPM, baseado em TypeScript) que busca e armazeda dados de Acórdãos do _Tribunal de Contas da União_ (TCU).

Como resultado, a ferramenta cria um arquivo de banco de dados SQLite para todos os acórdãos que contém os termos de busca "_internstício bolsa_".

Esta primeira versão não aplica filtros adicionais, o que acaba por armazenar um número considerável de "falsos positivos", ou seja, acórdãos e documentos referentes à processos que não são do tipo Tomada de Contas Especial e/ou não se referem à processos relaciados ao não cumprimento do interstício em casos de e/ou obrigações relacionandas em casos de bolsa no exterior.

### Adicionado

- Primeira versão da ferramenta, incluindo documentação mínima de pesquisa e uso

[unreleased]: https://github.com/exbolsistas/tcu-monitorador-processos-intersticio/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/exbolsistas/tcu-monitorador-processos-intersticio/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/exbolsistas/tcu-monitorador-processos-intersticio/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/exbolsistas/tcu-monitorador-processos-intersticio/releases/tag/v0.0.1
