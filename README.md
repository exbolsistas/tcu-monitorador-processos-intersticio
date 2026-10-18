# Análise e Monitoramento de Processos no TCU (Interstício)

Este repositório foi criado para eventualmente conter ferramentas para a criação e manutenção de um banco de dados de processos de _Tomada de Contas Especial_ (TCE) no _Tribunal de Contas da União_ (TCU) referentes ao não cumprimento da obrigação do retorno e permanencia no Brasil após o fim do período de consessão de bolsas no exterior (também conhecido como interstício), e/ou não cumprimento de obrigações relacionadas.

No momento, o reposiório contém notas de pesquisa, no arquivo [docs/pequisa.md](docs/pesquisa.md), cujas informações são usadas como base para a implementação das ferramentes, e uma primeira versão da ferramenta.

## Resultados

> [!NOTE]
> Link para o [Relatório preliminar da análise de acórdãos do Tribunal de Contas da União (TCU) até 2025](https://drive.google.com/file/d/138g-saLjU1JzPQEDr1H5pl16wrJmUPGq).

## Requisitos

A ferramenta, na sua forma atual, requer (ou pelo menos, foi testada com) Node.js versão `24.12.0`.

Recomenda-se o uso da ferramenta [asdf](https://asdf-vm.com/) para o gerenciamento de ambientes Node.js.

Para rodar a ferramenta, é necessária uma conexão de internet.

## Como usar

Para usar a ferramenta, siga os passos abaixo.

1. **Preparação**:
    1. Clone o repitório git no seu computador, e.g., com o comando
        ```sh
        git clone git@github.com:exbolsistas/tcu-monitorator-processos-intersticio.git
        ```
    2. Navegue até a pasta on foi clonado o repositório usando o seu terminal/linha de comando de preferência,
    3. Instale as dependências com o comando
        ```sh
        npm ci
        ```
2. **Uso**: 
    1. Rode a ferramenta de busca de dados com o comando
        ```sh
        npm start
        ```
    2. Rode a ferramenta de computação de dadso com o comando:
        ```sh
        npm run computa-dados
        ```
3. **Resultado**: A ferramenta irá criar, ou atualizar o arquivo de banco de dados SQLite `acordaos-tcu-intersticio.db` na pasta em que o comando foi rodado.

Uma vez criado o arquivo de banco de dados, é possível gerar um arquivo `.csv` com os campos de interesse para cada acórdão (e.g., usando a ferramenta [DBeaver](https://dbeaver.com/)).

## Documentação

Não há ainda documentação extensiva sobre a ferramenta, no entento, os seguintes documentos podem ser úteis:

- [docs/pesquisa.md](docs/pesquisa.md) - notas de pesquisa usadas na construção da ferramenta,
- [CHANGELOG.md](CHANGELOG.md) -  descrição das versões da ferramenta e alterações realizadas
- [src/banco-de-dados-local.mts](src/banco-de-dados-local.mts) - código fonte, contém a instrução de [Linguagem de definição de dados](https://pt.wikipedia.org/wiki/Linguagem_de_defini%C3%A7%C3%A3o_de_dados) SQL (_data description language_, DDL) com a definição da tabela do banco de dados (atualmente, uma única tabela)

## Governaça

O projeto é mantido atualmente por Guilherme Dellagustin.

O projeto ainda não foi apresentado ou discutido em reunião plenária.

A governança do [Núcleo de Vivências, Estudos e Lutas de (Ex-)bolsistas do Brasil no Exterior](https://exbolsistas.org) pode ser encontrada no [Estatuto do Núcleo](https://exbolsistas.org/estatuto/).

## Contribua

Contribuições são bem vindas.

Para contribuições de código, incluindo a documentação do projeto, que é mantida como código, i.e., arquivos em formato _Markdown_ (`.md`), envie um _Pull Request_.

Para outros tipos de contribuição, consulte a seção [Suporte](#suporte).

## Suporte

Caso você precise de ajuda com o uso da ferramenta, ou gostaria de contribuir com sugestões, comentários, _feedback_, reportes de problemas, perguntas, pedidos de melhorieas, etc..., entre em contato [criando uma issue](https://github.com/exbolsistas/tcu-monitorator-processos-intersticio/issues) no repositório do projeto.

Você pode também encontrar canais alternativos de contato em <https://exbolsistas.org/SUPPORT/>.

## Licença

O conteúdo desde repositório atualmente não possui uma licença.

É planejado que em um futuro próximo o conteúdo seja licenciado com uma licença de software livre e código aberto, porém é necessário ainda decidir qual licença usar.

## Direito Autoral

A propriedade intelectual do conteúdo deste repositório é do [Núcleo de Vivências, Estudos e Lutas de (Ex-)bolsistas do Brasil no Exterior](https://exbolsistas.org) e integrantes do mesmo.
