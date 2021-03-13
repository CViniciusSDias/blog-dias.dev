---
title: Requisições HTTP paralelas com PHP
date: "2021-03-13"
description: "Realizar requisições HTTP com PHP é uma tarefa corriqueira, mas comumente precisamos fazer várias ao mesmo tempo. Nesse artigo nós vamos aprender a fazer requisições HTTP paralelas com PHP."
---
## I/O não bloqueante (programação assíncrona)

Em um [post anterior](/2020-09-16-php-assincrono-de-forma-nativa) falei bastante sobre como o PHP trabalha por baixo dos panos de forma nativa com I/O não
bloqueante, e consequentemente com programação assíncrona. Usando os conhecimentos daquele post com conhecimentos de
_sockets_ e HTTP seria possível realizarmos chamadas HTTP assíncronas e processá-las conforme elas fossem recebidas.
Porém é bastante comum podermos nos dar ao luxo de processar todas as respostas HTTP depois de prontas, desde que todas
as requisições tenham sido feitas de forma concorrente.

## cURL

Como realizar requisições HTTP usando _sockets_ pode se tornar uma tarefa muito complicada, principalmente em cenários
onde precisamos enviar dados (requisições POST, por exemplo), cURL é uma alternativa muito interessante. Essa biblioteca
é pensada especialmente em realizar requisições pela rede e possui diversos facilitadores.

## O problema

Entendido o contexto das tecnologias que temos disponíveis, vamos falar do problema que temos em mãos. Existe uma API
que fornece informações sobre o universo _Star Wars_. Essa API é gratuita e vai servir perfeitamente para nosso exemplo.

O que queremos fazer é buscar a lista de filmes (através da url https://swapi.dev/api/films/) e para cada filme buscar
os seus detalhes em outra URL (https://swapi.dev/api/films/:id/).

### Solução bloqueante

Usando o `cURL` de forma “padrão”, ou seja, bloqueante, podemos atingir este objetivo com o seguinte código:

```php
<?php

$handle = curl_init('https://swapi.dev/api/films/');
// informa que não queremos exibir a resposta diretamente, mas sim pegar seu retorno
curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($handle);
curl_close($handle);

$data = json_decode($response, true);
$movies = $data['results'];

foreach ($movies as $movie) {
    // Alterando o protocolo para https
    $url = str_replace('http:', 'https:', $movie['url']);
    $handle = curl_init($url);
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($handle);

    $movieData = json_decode($response, true);
    var_dump($movieData);
}
```

O problema desta abordagem é que cada requisição para os detalhes do filme vai travar a execução do PHP, fazendo
com que a próxima requisição só seja iniciada quando a anterior for finalizada.

### Solução não bloqueante

Para informarmos um determinado número de requisições e realizarmos todas de uma vez, podemos usar o `curl_multi_init`.

```php
<?php

// Primeira requisição como no código anterior
$movies = $data['results'];

// Inicializa o handle de múltiplas conexões
$multiHandle = curl_multi_init();

// Armazena cada handle individual em um array
// além de adicioná-los ao $multiHandle
$handles = [];
foreach ($movies as $i => $movie) {
    $url = str_replace('http:', 'https:', $movie['url']);
    $handles[$i] = curl_init($url);
    curl_setopt($handles[$i], CURLOPT_RETURNTRANSFER, true);
    curl_multi_add_handle($multiHandle, $handles[$i]);
}
```

Assim nós temos diversos _handles_ do `cURL` adicionados a um gerenciador de múltiplas requisições. Quando executarmos o
`$multiHandle`, todas as requisições serão feitas em paralelo. Maravilha, não é mesmo?

Infelizmente não é tão simples assim. Não basta fazer um `curl_multi_exec` e receber um array de respostas. A função
`curl_multi_exec` inicia as requisições, porém não bloqueia o código, ou seja, nós precisamos ficar em um _loop_ verificando
se todas as requisições já foram feitas. Algo como:

```php
do {
    $result = curl_multi_exec($multiHandle, $numberOfMissingHandles);
} while ($numberOfMissingHandles > 0);

// Processar respostas
```

A variável `$numberOfMissingHandles` é passada por referência e é preenchida com o número dos _handles_ que faltam ser
resolvidos. Em outras palavras, enquanto esse valor não chegar a 0, temos requisições sendo processadas.

Depois de sair desse _loop_, podemos recuperar as respostas de todas as requisições, então voltamos para a tarefa fácil:

```php
// Por isso armazenamos o array de $handles
foreach ($handles as $handle) {
    // Usamos curl_multi_getcontent para recuperar a resposta
    // de cada um dos handles que foi executado pelo curl_multi_exec
    $response = curl_multi_getcontent($handle);
    curl_multi_remove_handle($multiHandle, $handle);
    curl_close($handle);

    $movieData = json_decode($response, true);
    var_dump($movieData);
}
```

Com isso nós atingimos o objetivo de realizar todas as requisições de uma vez e só depois ler as respostas.

### Mal uso de recursos

O problema da nossa abordagem é que a função `curl_multi_exec` retorna imediatamente, sem esperar por nenhuma atividade
nos _handles_, ou seja, se as requisições forem demoradas ou houverem muitas requisições (ou ambos), esse _loop_ vai ser
executado de forma muito rápida, por muito tempo. Isso vai fazer com que o uso de CPU vá ao topo, atrasando inclusive o
processo de realizar requisições, afinal de contas o sistema operacional precisa destinar certos recursos para essa tarefa.

Para mitigar esse problema, podemos usar uma função chamada `curl_multi_select`. Ela é semelhante à `stream_select` que
vimos no post sobre [PHP assíncrono](/2020-09-16-php-assincrono-de-forma-nativa). Essa função espera que alguma
atividade aconteça nos handles que estamos utilizando. A diferença é que ela não recebe um array, mas sim o nosso
`$multiHandle`. Então tudo que temos de informação é quantos _handles_ possuem atividade no momento, mas não quais deles.
Mas tudo bem, já que o nosso propósito é ler todos apenas no final.

A função `curl_multi_select` deve ser chamada após o `curl_multi_exec`, já que é essa que inicia as requisições efetivamente.
Então o nosso primeiro _loop_ ficaria assim:

```php
do {
    $result = curl_multi_exec($multiHandle, $numberOfMissingHandles);
    $descriptorsCount = curl_multi_select($multiHandle);
} while ($numberOfMissingHandles > 0);
```

Onde `$descriptorsCount` é o número de handles que possuem alguma atividade nesse exato momento. Caso esse número seja
`-1`, significa que aconteceu algum erro.

Dessa forma esse _loop_ será executado menos vezes e em um intervalo maior, ou seja, menos CPU será consumida.

### Tratamento de erros

Falando em erros, nosso código está supondo que tudo vai correr bem. Nesse primeiro _loop_ nós precisamos realizar algumas
verificações. Então no final, teremos algo como:

```php
do {
    $result = curl_multi_exec($multiHandle, $numberOfMissingHandles);
    if ($result !== CURLM_OK) { // CURLM_OK é uma constante que indica sucesso nesse caso
        throw new RuntimeException('Error executing all the requests', $result);
    }

    $descriptorsCount = curl_multi_select($multiHandle);
    if ($descriptorsCount === -1) {
        throw new RuntimeException('Error checking for activity');
    }
} while ($numberOfMissingHandles);
```

### Código final

Com isso finalizamos todo o processamento necessário para realizar requisições paralelas com PHP. O código completo vai
se parecer com isso:

```php
<?php

$handle = curl_init('https://swapi.dev/api/films/');
curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($handle);
curl_close($handle);

$data = json_decode($response, true);
$movies = $data['results'];

$multiHandle = curl_multi_init();

$handles = [];
foreach ($movies as $i => $movie) {
    $url = str_replace('http:', 'https:', $movie['url']);
    $handles[$i] = curl_init($url);
    curl_setopt($handles[$i], CURLOPT_RETURNTRANSFER, true);
    curl_multi_add_handle($multiHandle, $handles[$i]);
}

do {
    $result = curl_multi_exec($multiHandle, $numberOfMissingHandles);
    if ($result !== CURLM_OK) {
        throw new RuntimeException('Error executing all the requests', $result);
    }

    $descriptorsCount = curl_multi_select($multiHandle);
    if ($descriptorsCount === -1) {
        throw new RuntimeException('Error checking for activity');
    }
} while ($numberOfMissingHandles > 0);

foreach ($handles as $handle) {
    $response = curl_multi_getcontent($handle);
    curl_multi_remove_handle($multiHandle, $handle);
    curl_close($handle);

    $movieData = json_decode($response, true);
    var_dump($movieData);
}
```

Esse código provavelmente pode ser refatorado para torná-lo um pouco mais legível, mas acredito que a lógica por trás dele
tenha ficado clara. Caso contrário, você pode usar a sessão de comentários dessa página para fazer perguntas.

## Benchmarks

Agora que temos 2 versões de código que resolvem o mesmo problema de formas diferentes, podemos testar a sua performance.
Para quem usa sistemas _Unix_ (_Linux_ ou _Mac_) existe um comando chamado `time` que é muito útil para verificações simples
como essas.

A primeira versão do nosso código (bloqueante) gera essa informação quando executo o seguinte comando (sendo `star-wars.php`o nome do nosso arquivo):
```bash
$ time php star-wars.php

php star-wars.php  0.14s user 0.04s system 2% cpu 7.186 total
```
Basicamente, um pouco mais de 7 segundos foram necessários para executar todas as requisições.

Já com a versão final do código, temos a seguinte saída:
```bash
$ time php star-wars.php

php star-wars.php  0.14s user 0.04s system 6% cpu 2.387 total
```
Ou seja, pouco mais de 2 segundos (quase 5 segundos a menos). É uma baita diferença para um exemplo tão simples, não acha?

Agora um último teste, comentando a parte referente ao `curl_multi_select`:
```bash
$ time php star-wars.php

php star-wars.php  0.50s user 0.70s system 49% cpu 2.421 total
```
Repare que o uso de CPU subiu muito. De algo próximo de 6% para quase 50%. Esse é o propósito da chamada da função
`curl_multi_select`.

## Conclusão

Assim como já foi citado no post sobre [PHP assíncrono](/2020-09-16-php-assincrono-de-forma-nativa), existem
várias ferramentas que facilitam (e muito) o trabalho de realizar requisições HTTP paralelas com PHP. Guzzle é uma ótima
opção para isso.

Mas seguindo o que citei no [post sobre aprendizado](/2020-04-23-principios-ou-ferramentas-o-que-estudar), eu penso como
Richard Feynman (Nobel de física): “O que eu não consigo criar, eu não entendo”. Então antes de utilizar uma ferramenta
que realiza o trabalho para mim, eu gosto de saber como realizar este trabalho sem ela. Com isso, se algum problema
acontecer com a biblioteca, por exemplo, eu vou estar mais preparado para resolvê-lo já que entendo um pouco melhor como as coisas funcionam.
