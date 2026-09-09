---
title: "Computação Forense: Como Analisar Alterações em Documentos Word"
date: "2026-09-09"
description: "Veja como analisar documentos Word além do controle de alterações, usando RSIDs para identificar grupos de modificações e evidências digitais."
tags: [
    "computação forense",
    "perícia digital",
    "análise forense",
    "documento Word",
    "análise de documentos Word",
    "arquivo DOCX",
    "RSID",
    "Revision Save ID",
    "controle de alterações Word",
    "evidências digitais",
    "perícia documental",
    "php"
]
categories: ["Conceitos"]
video: false
---

Computação forense, ou perícia digital, é a ciência usada para lidar com evidências digitais, principalmente para serem usadas em tribunais.
Como estou fazendo uma pós-graduação na área, decidi escrever um pouco sobre um caso específico em que trabalhei para compartilhar não só um pouco da área, mas também um conhecimento específico sobre análise de documentos Word.

## Computação forense além da perícia criminal

É muito comum ver a área de computação forense associada com perícia criminal, casos de CSI, etc, mas o ramo de atuação é bem mais amplo.

Além da perícia criminal, existem os papéis de perito judicial, assistente técnico (também em casos judiciais), profissional de resposta a incidentes, etc.

Posso trazer um pouco de como funciona cada uma dessas formas de atuar em artigos futuros, mas nesse texto eu quero trazer como exemplo um caso concreto em que trabalhei prestando consultoria para uma empresa para realizar uma simples análise em um documento Word (`.docx`).

## Caso concreto - análise de documento Word

O pedido desse caso era uma "simples" análise documental: verificar o que é possível extrair de informações de um arquivo Word específico. Quem editou, quando editou e, principalmente, o que foi editado no documento.

O Word possui uma funcionalidade chamada **controle de alterações** que permite rastrear exatamente isso de forma muito simples, mas o documento em questão não possuía tal funcionalidade habilitada, logo, a gama de informações que podemos extrair é muito menor.

Informações como qual o usuário criador do documento, último usuário que realizou modificações nele e os horários de tais operações são triviais de se obter, mas nessa análise eu quis ir além: como identificar quais alterações no documento podem ser agrupadas para que possamos identificar padrões.

### RSID

Documentos Word no formato `.docx` possuem um conceito chamado _Revision Save ID_ (RSID). Ele é um identificador utilizado pelo Word para associar determinados elementos do documento a uma operação de edição ou salvamento.

Na prática, diferentes partes de um documento podem possuir RSIDs diferentes, permitindo identificar grupos de alterações e encontrar relações entre elas.

O RSID não identifica o usuário que fez a alteração e também não representa necessariamente uma única sessão de edição. Ele é apenas uma das evidências que podemos encontrar na estrutura interna do documento.

Salvar o documento, colar conteúdo copiado de outro documento e algumas outras operações registram um novo RSID. Para efeitos de simplicidade, vou chamar cada RSID de "sessão" daqui em diante, mas lembre-se que um RSID não significa necessariamente uma única sessão de edição. 

### Exemplo real

Vamos, para termos um cenário de exemplo, imaginar o seguinte: um novo documento é criado com o seguinte conteúdo:

<img src="/build/forense/documento-inicial.png" alt='Documento Word contendo 3 linhas os textos "Título", "Parágrafo 1" e "Parágrafo 2"' title="Documento Inicial">

Quando esse documento for salvo nós podemos constatar que todo o conteúdo nele foi criado pelo mesmo RSID, ou seja, pela mesma sessão.

Após salvar o documento inicial, realizamos duas alterações: primeiro, trocamos a palavra "Parágrafo" do primeiro parágrafo por "Texto" e salvamos. Logo após, adicionamos um novo parágrafo contendo o texto "Parágrafo 3". Esse seria o resultado do documento:

<img src="/build/forense/documento-alterado.png" alt="Documento Word após as alterações descritas acima" title="Documento alterado">

Com isso teríamos as seguintes "sessões" com seus respectivos _RSIDs_:

- RSID inicial que criou o "Título" e o "Parágrafo 2"
- Segundo RSID que alterou o texto "Parágrafo 1" para "Texto 1"
- Terceiro RSID que criou o "Parágrafo 3"

Conseguir identificar essas diferentes "sessões" em um documento fictício pode não ser tão útil, mas em um documento empresarial, por exemplo, pode trazer informações valiosas sobre quais partes do documento foram alteradas e até identificar possível má-fé em um processo de negociação.

## Ferramentas de análise

Análise de documentos Word **além do controle de alterações** que o próprio editor fornece não é uma tarefa com muitas ferramentas disponíveis. O mais comum nesse cenário é extrair o documento e analisar cada arquivo XML individualmente.

> Documentos `.docx` são basicamente um arquivo ZIP contendo diversos arquivos XML em sua estrutura interna contendo conteúdo, formatação, etc.

Em um arquivo muito grande, essa análise manual seria inviável, então, como bom programador PHP, desenvolvi dois simples scripts para automatizar essa tarefa. O primeiro, e que foi utilizado no caso para enviar o laudo, extrai um arquivo CSV identificando quais alterações foram feitas por cada RSID. A seguir está um exemplo da saída desse script para aquele documento inicial, com somente um RSID:

| RSID     | Tipo_Alteracao       | Paragrafo    | Conteudo                                 |
|:---------|:---------------------|:-------------|:-----------------------------------------|
| 6E46E0AC | Texto                | parágrafo #1 | Título                                   |
| 6E46E0AC | Criação de parágrafo | parágrafo #2 | Marca de parágrafo inserida nesta sessão |
| 6E46E0AC | Texto                | parágrafo #2 | Parágrafo 1                              |
| 6E46E0AC | Criação de parágrafo | parágrafo #3 | Marca de parágrafo inserida nesta sessão |
| 6E46E0AC | Texto                | parágrafo #3 | Parágrafo 2                              |


E aqui está a saída do comando para a versão final do documento, com diferentes RSIDs salvando o conteúdo:

| RSID     | Tipo_Alteracao          | Paragrafo                           | Conteudo                                                                                         |
|:---------|:------------------------|:------------------------------------|:-------------------------------------------------------------------------------------------------|
| 6E46E0AC | Texto                   | parágrafo #1                        | Título                                                                                           |
| 6E46E0AC | Texto                   | parágrafo #2                        | o 1                                                                                              |
| 6E46E0AC | Criação de parágrafo    | parágrafo #3                        | Marca de parágrafo inserida nesta sessão                                                         |
| 6E46E0AC | Texto                   | parágrafo #3                        | Parágrafo 2                                                                                      |
| 3920D9B0 | Formatação de parágrafo | parágrafo #1                        | Propriedades do parágrafo (alinhamento, espaçamento, estilo) definidas ou alteradas nesta sessão |
| 3920D9B0 | Definição de estilo     | word/styles.xml / estilo 'Heading1' | Estilo 'heading 1' (tipo: paragraph) criado ou alterado por último nesta sessão                  |
| 6E368697 | Criação de parágrafo    | parágrafo #2                        | Marca de parágrafo inserida nesta sessão                                                         |
| 6E368697 | Texto                   | parágrafo #2                        | Text                                                                                             |
| 7DCB8B2E | Criação de parágrafo    | parágrafo #4                        | Marca de parágrafo inserida nesta sessão                                                         |
| 7DCB8B2E | Texto                   | parágrafo #4                        | Parágrafo 3                                                                                      |

Repare que com esse arquivo CSV seria possível identificar que o "Parágrafo 1" foi alterado para "Texto 1" por um RSID diferente do que criou o documento, porém seria muito difícil identificar cada alteração em um documento real com muitas alterações.

E é aí que entra o segundo script que criei, que analisa o documento original e cria um novo contendo cores de fundo que identificam cada alteração, conforme a imagem a seguir:

<img src="/build/forense/documento-marcado.png" alt="Captura de tela de um documento com quatro parágrafos destacados em cores diferentes" title="Documento Marcado">

Visualmente, fica muito mais fácil perceber como as diferentes partes do documento estão relacionadas.

No exemplo acima, podemos identificar que determinados trechos foram criados ou modificados em um grupo de alterações, enquanto outros pertencem a grupos diferentes. Isso permite analisar o documento de uma forma muito mais intuitiva do que simplesmente olhando para uma lista de identificadores.

### O que essa análise permite descobrir?

É importante deixar claro que essa técnica não permite descobrir, sozinha, quem fez cada alteração.

Um RSID não é um usuário, não é uma conta do Windows e não é uma assinatura digital. Portanto, não podemos concluir que "RSID X foi criado por João" apenas porque encontramos esse identificador no documento.

O que podemos fazer é correlacionar diferentes evidências.

Por exemplo, podemos encontrar nos metadados que determinado usuário foi o último responsável por salvar o documento e, ao mesmo tempo, encontrar diferentes grupos de alterações no conteúdo. Isso pode ajudar a construir uma linha de investigação, mas não permite atribuir automaticamente cada alteração àquela pessoa.

Essa distinção é especialmente importante em uma análise forense: uma evidência técnica precisa ser interpretada dentro do contexto e não deve sustentar uma conclusão maior do que aquilo que ela realmente demonstra.

## Limitações

A análise de RSIDs é interessante justamente porque permite encontrar informações que não ficam visíveis para o usuário comum do Word. Mas ela possui limitações importantes.

O documento `.docx` não é um sistema de versionamento. Ele não mantém necessariamente um histórico completo de tudo o que aconteceu durante sua existência.

Uma pessoa pode abrir o documento, fazer diversas alterações, copiar conteúdo de outro arquivo, salvar, fechar e depois realizar novas alterações. Muitas dessas operações podem não deixar evidências suficientes para reconstruir exatamente a sequência dos acontecimentos.

Também não é possível assumir que cada RSID representa uma única sessão de edição ou uma única ação do usuário.

Por isso, a análise dos RSIDs deve ser encarada como uma fonte de evidências, e não como um histórico completo do documento.

Dependendo do caso, outras informações também podem ser relevantes, como metadados do arquivo, propriedades do documento, cópias anteriores e outros artefatos encontrados no ambiente analisado.

## Conclusão

Embora relativamente simples, esse caso foi interessante, pois mostrou que mesmo sem o controle de alterações habilitado, a estrutura interna do `.docx` pode preservar evidências que ajudam a entender como diferentes partes do documento foram criadas ou modificadas.

Os RSIDs são apenas um exemplo disso. Sozinhos, eles não permitem reconstruir perfeitamente o histórico de um documento nem identificar quem realizou cada alteração. Porém, quando analisados em conjunto com outras evidências, podem ser bastante úteis para uma investigação.

E esse é justamente um dos aspectos mais interessantes da computação forense: muitas vezes, a informação mais relevante não está naquilo que o usuário consegue ver, mas nos rastros deixados pela forma como os dados foram armazenados.

No meu caso, uma "simples" análise de um documento Word acabou se tornando um projetinho para automatizar a identificação desses rastros e eu decidi compartilhar aqui com vocês.
