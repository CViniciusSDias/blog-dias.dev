---
title: "PHP assíncrono de forma nativa"
date: "2020-09-16"
description: "O PHP é uma linguagem de programação completa e programação assíncrona não é algo que falta na linguagem. Nesse post eu mostro como atingir este objetivo sem nenhum componente externo"
tags: ["PHP", "Assíncrono", "Paralelo", "I/O Não bloqueante", "Dias de Dev"]
categories: ["PHP", "Conceitos"]
---
Realizar acesso a streams é uma tarefa relativamente comum para devs PHP. Seja lendo e escrevendo em arquivos, fazendo requisições HTTP, etc.

Operações de I/O são custosas e levam algum tempo para executar. Quando temos diversas operações desse tipo, uma técnica que pode ajudar (e muito) na performance da aplicação é realizá-las de forma assíncrona.

## Acesso a streams

Antes de falar sobre técnicas e funções que permitem a programação assíncrona, é importante saber como normalmente nós trabalhamos com I/O.

Acesso a arquivos, requisições HTTP, sockets e muito mais pode ser feito através de [streams](https://php.net/streams). Um stream é basicamente um fluxo de dados, sendo que a origem desse fluxo pode variar (vide o início desse parágrafo). Quando utilizamos funções como `file_get_contents`, `fopen`, `fgets`, e as demais, estamos trabalhando com streams do PHP.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## Programação assíncrona

Se você não está familiarizado com o termo "programação assíncrona", recomendo assistir este vídeo antes de continuar o artigo:

<lite-youtube videoid="zLfXPSeCkB8">
    <a href="https://youtube.com/watch?v=zLfXPSeCkB8" class="lty-playbtn" title="Reproduzir vídeo">
        <span class="lyt-visually-hidden">
            Programação assíncrona vs Programação paralela - Entenda a diferença | Programando com Vinicius Dias
        </span>
    </a>
</lite-youtube>

Entendido o que é programação assíncrona, como podemos fazer acesso a streams de forma assíncrona utilizando PHP sem nenhuma extensão ou biblioteca externa? Será possível?

## Eventos

Programação orientada a eventos não é novidade e nós utilizamos muito na web. Para agir quando um botão for clicado, ou quando um texto for digitado em um `input` nós utilizamos eventos no JavaScript. Eventos podem acontecer a qualquer momento então sua natureza é assíncrona. Mas será possível fazer algo parecido do lado do PHP?

Antes de falar do PHP em si, acho válido citar que o sistema operacional já trabalha com chamadas assíncronas. Diversos eventos acontecem durante a execução do seu sistema, e há código reagindo a estes eventos o tempo todo. Utilizando PHP nós podemos acessar algumas dessas funcionalidades do sistema operacional

### Função stream_select

Uma função não muito comum para nós que trabalhamos com PHP é a [stream_select](https://php.net/stream_select). Essa função nos permite "observar" modificações que possam acontecer em streams. O probelma é que ela não é nada fácil de se entender, então vou tentar tornar este processo menos doloroso para você.

## Cenário

Imagine que para executar uma tarefa nós precisemos ler 5 arquivos distintos e depois realizar algum processamento. Normalmente utilizando PHP nós poderíamos fazer algo como:

```php
<?php

$conteudoDoArquivo1 = file_get_contents('arquivo1.txt');
$conteudoDoArquivo2 = file_get_contents('arquivo2.txt');
$conteudoDoArquivo3 = file_get_contents('arquivo3.txt');
$conteudoDoArquivo4 = file_get_contents('arquivo4.txt');
$conteudoDoArquivo5 = file_get_contents('arquivo5.txt');

// Processar os 5 arquivos
```

O problema nessa abordagem é óbvio: Antes de ler o `arquivo2.txt` precisamos terminar de ler todo o conteúdo de `arquivo1.txt`. Enquanto o computador espera, nós já poderíamos estar lendo os demais arquivos e os processando de forma individual.

Quando temos uma operação de I/O (acesso a arquivos, rede, etc) sendo realizada de forma síncrona, o processador fica ocioso enquanto a operação não é executada. Ou seja, enquanto o arquivo estiver sendo carregado, o processador fica esperando, sem fazer nada. É exatamente isso que queremos evitar. Queremos garantir que ele continue trabalhando enquanto o arquivo não estiver pronto para leitura.

## Solução com assincronicidade

Para resolver essa situação, podemos utilizar a função `stream_select` que observa alterações no status de uma lista de streams, ou seja, quando algum dos arquivos estiver pronto para leitura, essa função nos avisará. E é interessante citar que a leitura não necessariamente vai acontecer em ordem. O sistema operacional pode abrir o `arquivo3.txt` mais rápido do que o `arquivo1.txt`, por exemplo. Neste cenário, vamos processá-lo logo, sem ficar esperando os arquivos anteriores.

```php
<?php

$listaDeStreamsDeArquivos = [
    fopen('arquivo1.txt', 'r'),
    fopen('arquivo2.txt', 'r'),
    fopen('arquivo3.txt', 'r'),
    fopen('arquivo4.txt', 'r'),
    fopen('arquivo5.txt', 'r'),
];

foreach ($listaDeStreamsDeArquivos as $streamDeArquivo) {
    stream_set_blocking($streamDeArquivo, false);
}

do {
    $streamsParaLer = $listaDeStreamsDeArquivos;
    $streamsComNovidades = stream_select($streamsParaLer, $write, $except, 1, 0);

    if ($streamsComNovidades === false) {
        echo 'Erro inesperado';
        exit(1);
    }

    if ($streamsComNovidades === 0) {
        continue;
    }

    foreach ($streamsParaLer as $indice => $streamDeArquivo) {
        $conteudo = stream_get_contents($streamDeArquivo);
        // processa o conteúdo do arquivo
        if (feof($streamDeArquivo)) {
            fclose($streamDeArquivo);
            unset($listaDeStreamsDeArquivos[$indice]);
        }
    }
} while ($listaDeStreamsDeArquivos !== []);
```

### Explicação

#### Preparação

Como eu disse, não é muito fácil, então vamos por partes. Primeiro abrimos todos os arquivos que queremos ler com o `fopen`. Até aí sem segredo. Depois, informamos com a função `stream_set_blocking` que o recurso deve ser aberto em modo não-bloqueante - assim, o processo que acessa o arquivo não bloqueará a CPU por causar um estado de espera ao tentar acessar os arquivos.

Nesse ponto, temos um array com 5 recursos abertos para podermos trabalhar com estes streams. Então analisando o este pedaço de código:

```php
$listaDeStreamsDeArquivos = [
    fopen('arquivo1.txt', 'r'),
    fopen('arquivo2.txt', 'r'),
    fopen('arquivo3.txt', 'r'),
    fopen('arquivo4.txt', 'r'),
    fopen('arquivo5.txt', 'r'),
];

var_dump($listaDeStreamsDeArquivos);
```

Teríamos a seguinte saída:
```php
array(5) {
  [0]=>
  resource(5) of type (stream)
  [1]=>
  resource(6) of type (stream)
  [2]=>
  resource(7) of type (stream)
  [3]=>
  resource(8) of type (stream)
  [4]=>
  resource(9) of type (stream)
}
```

Depois disso que começa a parte difícil. A chamada para a função `stream_select` deve estar em um loop, porque pode acontecer de nem todos os streams estarem prontos para leitura logo de cara.

#### Parâmetros

Segundo detalhe importante: os parâmetros. O 3 primeiros parâmetros dessa função são passados por referência. Por isso o segundo e terceiro são variáveis que nós nem tínhamos definido ainda. O primeiro parâmetro é a lista de streams que queremos observar para ler. O segundo é para escrita. Já o terceiro, menos comum, é para dados excepcionais que possuem maior prioridade. Os 2 últimos parâmetros são sobre timeout.

O parâmetro passado como 1 indica o número de segundos que essa função deve esperar receber uma notificação de novidade nos streams até "desistir", ou seja, o timeout. Esse é o motivo pelo qual ela deve estar em um loop. Se esse tempo passar e nós não tivermos novidade, devemos tentar de novo depois. Caso algum (não necessariamente todos) stream esteja pronto antes desse 1 segundo, a função retornará. O último parâmetro, que informamos como 0, indica o tempo em microsegundos para timeout.

#### Retorno e leitura

Agora vamos falar do retorno. Essa função retorna o número de streams que contém modificações. No nosso caso, vai informar quantos arquivos estão prontos para leitura. Porém em caso de erro essa função nos retorna o valor `false`.

Além disso, os parâmetros que nós passamos podem ter sido modificados. Por isso eu realizo uma cópia da lista original de streams em `$arquivosParaLer = $listaDeArquivos;`. Após o retorno da função, o parâmetro passado vai conter apenas os streams que possuem novidades, ou seja, no nosso caso, os arquivos que estão prontos para leitura.

Para exemplificar, vamos supor que na primeira execução do loop todos os arquivos já estejam disponíveis. Nesse caso, analisando os valores das variáveis, podemos entender o que está acontecendo. Analisando então o valor de `$streamsComNovidades`, teríamos `int(5)` como resultado deste cenário.

Já analisando ambos arrays de streams (`$listaDeStreamsDeArquivos` e `$streamsParaLer`), teríamos exatamente o mesmo resultado:

```php
array(5) {
  [0]=>
  resource(5) of type (stream)
  [1]=>
  resource(6) of type (stream)
  [2]=>
  resource(7) of type (stream)
  [3]=>
  resource(8) of type (stream)
  [4]=>
  resource(9) of type (stream)
}
array(5) {
  [0]=>
  resource(5) of type (stream)
  [1]=>
  resource(6) of type (stream)
  [2]=>
  resource(7) of type (stream)
  [3]=>
  resource(8) of type (stream)
  [4]=>
  resource(9) of type (stream)
}
```

Agora caso na primeira execução tivéssemos apenas 3 dos 5 arquivos prontos, e analisássemos os 3 valores anteriores, teríamos ter algo como:

```php
var_dump($streamsComNovidades, $listaDeStreamsDeArquivos, $streamsParaLer);
```
```php
int(3)
array(5) {
  [0]=>
  resource(5) of type (stream)
  [1]=>
  resource(6) of type (stream)
  [2]=>
  resource(7) of type (stream)
  [3]=>
  resource(8) of type (stream)
  [4]=>
  resource(9) of type (stream)
}
array(3) {
  [0]=>
  resource(5) of type (stream)
  [2]=>
  resource(7) of type (stream)
  [4]=>
  resource(9) of type (stream)
}
```

Onde, nesse caso, o segundo array exibido é o de `$streamsParaLer`, e possui apenas os 3 arquivos prontos para leitura.

Sendo assim, posso percorrer este array tendo a certeza de que há dados para ler e processar. Mas não há garantia de que todo o conteúdo do arquivo estará lá, por isso verifico se cheguei ao fim do arquivo com `feof`. Para arquivos pequenos, via de regra, todo o conteúdo virá de uma vez só, mas não conte com isso e prepare seu código para ler até mesmo um único byte por vez.

Após ler todo o arquivo, devemos fechá-lo. Mas um outro detalhe importante é que eu também o removo da lista original de streams que queremos ler. Faço isso para que caso seja necessária uma nova iteração no loop, ou seja, caso nem todos os arquivos tenham sido lidos, eu não tente ler novamente os arquivos que já foram lidos e fechados.

Com isso temos nossa condição de saída do loop. Quando todos os arquivos tiverem sido removidos e minha lista estiver vazia, sei que processei todos os arquivos.

PS.: A função `stream_set_blocking` só surte efeito com arquivos e sockets. Os outros wrappers, com esta técnica, não podem ser lidos de forma assíncrona e não bloqueante.

## Conceitos

Esse código obviamente pode ser refatorado para torná-lo um pouco mais legível, mas acredito que a lógica por trás dele tenha ficado clara. Caso contrário, você pode usar a sessão de comentários dessa página para fazer perguntas.

O que nós escrevemos de forma rudimentar aqui pode ser visto como uma implementação do que é conhecido como _Event Loop_, ou loop de eventos. Você provavelmente já ouviu esse termo se estuda sobre a runtime Node.js.

Claro que essa implementação não é completa ou otimizada, mas atende nosso propósito: ler arquivos conforme eles fiquem prontos para leitura. Dessa forma nós vamos pedir para que o sistema operacional prepare todos os arquivos para leitura de uma só vez.

As vantagens nessa abordagem assíncrona são mais perceptíveis quando temos operações mais lentas como chamadas HTTP, por exemplo. Mas isso aumentaria a complexidade do código para este artigo.

## Conclusão

Claro que o PHP já possui ferramentas que realizam este trabalho de forma muito mais simples. ReactPHP com seu pacote de Streams é um ótimo exemplo.

Mas seguindo o que citei no post sobre aprendizado, eu penso como [Richard Feynman](https://pt.wikipedia.org/wiki/Richard_Feynman) (Nobel de física): "O que eu não consigo criar, eu não entendo". Então antes de utilizar uma ferramenta que realiza o trabalho para mim, eu gosto de saber como realizar este trabalho sem ela. Com isso, se algum problema acontecer com a biblioteca, por exemplo, eu vou estar mais preparado para resolvê-lo já que eu entendo um pouco melhor como as coisas funcionam.

Se você quiser aprender mais sobre algum desses assuntos, pode considerar assinar a Alura. Lá existem treinamentos (gravados por mim) sobre PHP Streams, ReactPHP e muito mais. Caso pretenda estudar na Alura, [neste link](https://alura.tv/diasdedev) você tem um desconto de 10%.
