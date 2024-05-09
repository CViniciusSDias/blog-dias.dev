---
title: "Locks de bancos de dados: Como Funcionam os Bloqueios Exclusivos e Compartilhados"
date: "2024-05-10"
description: "Descubra como os bloqueios exclusivos e compartilhados em bancos de dados garantem a consistência dos seus dados. Este texto explora o funcionamento dos locks de bancos de dados e sua importância para a integridade dos sistemas. Saiba como aplicar essas técnicas para evitar conflitos em transações concorrentes."
tags: [
    "Bloqueios de bancos de dados",
    "Locks de bancos de dados",
    "Bloqueios exclusivos",
    "Bloqueios compartilhados",
    "Exclusive locks",
    "Shared locks",
    "Database locking",
    "Locks pessimistas",
    "Locks otimistas",
    "Consistência de dados",
    "Transações concorrentes",
    "Bancos de dados relacionais",
    "Integridade dos sistemas",
    "SQL",
    "Estratégias de bloqueio de dados"
]
categories: ["Conceitos"]
video: true
---

_Locks_ (bloqueios) de bancos de dados são uma técnica utilizada para garantir a consistência dos dados quando diversas transações são executadas em forma concorrente. Vamos entender nesse texto a diferença entre dois tipos de _locks_ de bancos de dados: bloqueios exclusivos (_exclusive locks_) e bloqueios compartilhados (_shared locks_).

## O que são bloqueios de bancos de dados

Antes de conhecermos os tipos de _locks_, é importante entendermos **o que são** os bloqueios dos bancos de dados. Imagine o seguinte cenário: um produto está a venda e possui apenas 1 unidade em estoque. O que acontece se 2 pessoas clicarem no botão de compra simultaneamente? Se você tiver um código semelhante ao seguinte, terá problemas.

```sql
SELECT estoque FROM produto WHERE id = ?;

-- Na aplicação, verifica se estoque > 0.
-- Se sim:
UPDATE produto SET estoque = estoque - 1 WHERE id = ?;
```

O que acontece é que se duas pessoas clicarem em "comprar" ao mesmo tempo, ambas terão como resultado do `SELECT` o produto com 1 unidade em estoque, e ambas subtrairão esse item do estoque, gerando uma venda a mais do que o permitido.
Agora imagine se 100 pessoas comprarem em simultâneo. E se 1000 pessoas o fizerem? Para esse cenário existem os bloqueios (_locks_) de bancos de dados.

## Bloqueios implícitos

Um "detalhe" que nem toda pessoa iniciante no mundo de banco de dados sabe é que mesmo sem conhecer o conceito de _locks_, eles ainda são utilizados por _queries_ do dia-a-dia. Ao realizar o `UPDATE` citado no parágrafo anterior, por exemplo, há um bloqueio no registro que está sendo alterado. Isso significa que se duas conexões tentarem realizar o `UPDATE` ao mesmo tempo, uma delas conseguirá executar enquanto a outra ficará em um estado de espera até que a primeira termine. Só então a segunda poderá prosseguir e ser executada.

Se não fosse assim, em nosso exemplo uma das compras poderia iniciar a alteração (`UPDATE`) da quantidade de estoque (de 1 para 0), e antes dessa instrução finalizar no banco de dados, a outra compra poderia realizar exatamente a mesma operação. Sendo assim, as duas compras teriam subtraído apenas 1 item do estoque, gerando um problema completamente diferente.

Quando realizamos operações de _DML_, ou seja, operações como `INSERT`, `UPDATE` e `DELETE`, os registros que serão afetados são bloqueados para que nenhum outro comando que esteja sendo executado em paralelo cause problemas de consistência. Isso ocorre automaticamente, por isso o nome de "bloqueios implícitos" (_implicit locking_).

## Bloqueios explícitos

Em diversos cenários, nós precisamos bloquear algum(ns) registro(s) de forma manual, pois não será executada apenas 1 _query_ nele(s). O exemplo da compra de um produto é exatamente esse caso: primeiro nós buscamos os dados do produto, e após verificar esses dados em nossa aplicação, nós realizamos a atualização. Ou seja, realizamos primeiro um `SELECT` e depois um `UPDATE`.

O problema é que precisamos bloquear esse registro já no momento do `SELECT` para que nenhuma consulta sendo executada concorrentemente busque a quantia incorreta do estoque, ou seja, precisamos fazer isso de forma explícita. Dessa forma, nós dizemos que queremos obter um _lock_ para o registro em questão, garantindo que antes de terminarmos a atualização, ninguém vai acessá-lo.

Para realizarmos um bloqueio explícito (_explicit locking_) nós precisamos, antes de qualquer coisa, envolver as _queries_ em uma transação. Então a primeira mudança no código do exemplo anterior seria iniciar uma transação antes de buscar o estoque e encerrá-la somente após realizar a alteração.

```sql
START TRANSACTION;
    SELECT estoque FROM produto WHERE id = ?;

    -- Na aplicação, verifica se estoque > 0.
    -- Se sim:
    UPDATE produto SET estoque = estoque - 1 WHERE id = ?;
COMMIT;
```

Claro que os comandos de iniciar e finalizar a transação seriam realizados utilizando a interface de acesso ao banco de dados que sua linguagem de programação fornece, mas por baixo dos panos, as instruções de início e término de transação seriam enviados para o banco da forma como o exemplo mostra.

Porém, essa modificação ainda não faz com que o nosso objetivo seja atingido. Várias transações podem buscar o estoque ainda antes dele ter sido atualizado e elas podem acabar realizando o `UPDATE` em um item que possivelmente teria o estoque zerado. Para informarmos ao banco que apenas uma transação por vez pode manipular esse registro, precisamos modificar nossa _query_ `SELECT`. E é nessa modificação que vamos identificar se é um _lock_ exclusivo ou compartilhado.

### Bloqueio exclusivo

Para nosso cenário, nós queremos obter um tipo de bloqueio para podermos atualizar o registro futuramente na transação, ou seja, nós vamos informar que somente 1 transação pode realizar essa operação por vez. Isso acontece porque antes da transação atual finalizar, o valor do estoque pode ser alterado, então as outras transações concorrentes precisam esperar a transação atual ser finalizada para só então poderem buscar o dado. Assim garantimos que todas as transações recuperarão a informação correta.

Essa é a ideia de um bloqueio exclusivo (_exclusive lock_) e pode ser feito adicionando um simples `FOR UPDATE` ao nosso `SELECT`:

```sql
START TRANSACTION;
    SELECT estoque
      FROM produto
     WHERE id = ?
       FOR UPDATE;

    -- Na aplicação, verifica se estoque > 0.
    -- Se sim:
    UPDATE produto SET estoque = estoque - 1 WHERE id = ?;
COMMIT;
```

Agora, ao realizar esse `SELECT`, nós estamos informando ao banco que nenhuma outra transação pode realizar nenhuma operação nos registros que esse `SELECT` nos retornar até que a transação atual seja encerrada, ou seja, independente de quantas compras forem feitas de forma paralela, apenas uma transação por vez poderá agir sobre os dados desse produto. Isso garante que aquela verificação de `estoque > 0` seja segura, já que em uma nova transação o estoque só será buscado após todas as alterações de uma transação existente sejam realizadas.

Essa foi a estratégia utilizada na explicação de outro conceito no meu canal do YouTube, onde falo sobre bloqueios pessimistas (_pessimistic locking_) e bloqueios otimistas (_optimistic locking_): 

<lite-youtube videoid="BsCdPKNX8rc" style="background-image: url('https://i.ytimg.com/vi/BsCdPKNX8rc/hqdefault.jpg');">
    <a href="https://youtube.com/watch?v=BsCdPKNX8rc" class="lty-playbtn" title="Reproduzir vídeo">
        <span class="lyt-visually-hidden">Reproduzir vídeo: Garantindo a Consistência de Dados com Locks Pessimistas e Locks Otimistas | Dias de Dev</span>
    </a>
</lite-youtube>

### Bloqueio compartilhado

Agora imagine o seguinte cenário: você está realizando diversas consultas no banco de dados para montar um relatório. Sendo assim, entre as diversas consultas que serão executadas, você quer garantir a consistência, mas o tipo de bloqueio que você quer adquirir agora é um pouco menos "restrito", já que múltiplas transações gerando o relatório podem ser executadas de forma paralela sem nenhum problema.

Isso quer dizer que o bloqueio que queremos obter agora não vai ficar esperando outras transações que apenas pretendem ler o mesmo registro. E quando obtivermos esse bloqueio, outras transações continuam podendo ler os registros bloqueados sem problema. Apenas modificações nesses registros precisarão aguardar que a transação finalize, garantindo a consistência do relatório.

Para esse cenário, o _lock_ exclusivo (através do `FOR UPDATE`) vai realizar um bloqueio muito "agressivo", não atingindo nosso objetivo e travando até mesmo as consultas dos demais relatórios. Ao invés de utilizamos `FOR UPDATE`, vamos utilizar a instrução `FOR SHARE` para a criação desse **bloqueio compartilhado** (_shared lock_).

```sql
START TRANSACTION;
    SELECT estoque
      FROM produto
     WHERE id = ?
       FOR SHARE;

    -- Demais consultas
COMMIT;
```

Isso garante que outras transações possam realizar consultas nos registros bloqueados (e obter _locks_ compartilhados), mas não possam realizar nenhuma modificação (nem obter _locks_ exclusivos), ou seja, nenhuma atualização pode ser feita no produto selecionado até que a transação seja finalizada, mas outras transações podem ler os detalhes desse produto de forma concorrente sem nenhum problema.

## Conclusão

Bancos de dados e especificamente _locks_ são um assunto muito extenso e importante não só para desenvolvedores, mas também para _QAs_, _tech leads_, _SREs_, etc. É de extrema importância conhecer bem o funcionamento do banco de dados utilizado para garantir a consistência e segurança dos dados da aplicação.

Para se aprofundar em assuntos de bancos de dados, recomendo a Alura! Lá, há **vários** cursos sobre o assunto, utilizando diversos bancos diferentes como MySQL, PostgreSQL, SQLite, Oracle e SQL Server. Aqui tem um [cupom de 15% desconto](https://tidd.ly/4d42Myb) para você aproveitar a plataforma.
