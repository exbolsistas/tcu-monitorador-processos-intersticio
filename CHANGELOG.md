# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Mantenha um Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto usa [Versionamento Semântico](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2025-12-27

Esta é a primeira versão usável de uma ferramenta (pacote NPM, baseado em TypeScript) que busca e armazeda dados de Acórdãos do _Tribunal de Contas da União_ (TCU).

Como resultado, a ferramenta cria um arquivo de banco de dados SQLite para todos os acórdãos que contém os termos de busca "_internstício bolsa_".

Esta primeira versão não aplica filtros adicionais, o que acaba por armazenar um número considerável de "falsos positivos", ou seja, acórdãos e documentos referentes à processos que não são do tipo Tomada de Contas Especial e/ou não se referem à processos relaciados ao não cumprimento do interstício em casos de e/ou obrigações relacionandas em casos de bolsa no exterior.

### Adicionado

- Primeira versão da ferramenta, incluindo documentação mínima de pesquisa e uso


<!--
[unreleased]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/olivierlacan/keep-a-changelog/releases/tag/v0.0.1
-->
