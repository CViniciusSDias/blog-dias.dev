---
title: "Copy on Write no PHP: Como o PHP te economiza memória automaticamente por nós"
date: "2024-04-18"
description: ""
tags: [
    "PHP",
    "Desenvolvimento Web",
    "Dias de Dev",
    "Vinicius Dias"
]
categories: ["PHP"]
video: false
---

_CoW (Copy on Write)_, significa que um dado só é copiado em memória se alguma escrita for feita nele. No PHP, isso significa que os dados de um _array_ só são copiados se nós realizarmos alguma escrita nessa cópia, evitando um grande desperdício de memória. Vem comigo nesse texto para entender melhor.

## _Arrays_ e consumo de memória

Um _array_, em diversas linguagens, utiliza uma _estrutura de dados_ conhecida como **vetor**, enquanto em PHP uma estrutura conhecida como _HashMap_ é utilizada por baixo dos panos. Mas independente de qual estrutura de dados é utilizada, uma coisa é óbvia: _arrays_ podem ocupar bastante espaço na memória. PS.: se quiser aprender sobre estruturas de dados com PHP, aqui tem um [cupom de desconto para a Alura](https://tidd.ly/4d42Myb) e lá tem cursos sobre o assunto. 😉

Pensa naquela última query super demorada que você fez e retorna um caminhão de dados do banco. Agora imagina armazenar isso tudo em sua aplicação PHP. Isso vai ocupar espaço. Inclusive, na maioria das vezes vamos usar paginação de dados para não cairmos em alguns problemas, mas isso é assunto para outro post.

Vamos simular de forma bastante simples um _array_ grande, e vamos ver quanta memória ele ocupa. Para isso, vamos usar a função `memory_get_usage` para recuperar o uso de memória e a função `array_fill` para criar um _array_ com muitos dados.

```php
<?php

// Armazena o uso de memória inicial
$memoriaInicial = memory_get_usage();

// Cria um array de 1000 elementos
$arrayGrande = array_fill(0, 1000, 'Valor de exemplo');

$memoriaUsada = memory_get_usage() - $memoriaInicial;

// Exibe a memória ocupada em KB
echo $memoriaUsada / 1024;
```

O trecho de código acima vai mostrar que utilizamos aproximadamente 20 _kilobytes_ após copiarmos um array contendo 1000 strings. Agora vamos realizar uma cópia desse array grande. Podemos fazer isso o passando por parâmetro para uma função, ou simplesmente o associando a uma nova variável:

```php
// ...
$copiaDoArray = $arrayGrande;
```

Sendo assim, eu esperaria que a memória utilizada agora fosse de aproximadamente 40 _kilobytes_, já que tenho o array ocupando 20 KB duas vezes. Porém, se eu realizo a medição, tenho uma surpresa:

```php
// ...
echo (memory_get_usage() - $memoriaInicial) / 1024;
```

Eu vejo agora um uso de aproximadamente 21 KB, ou seja, o consumo de memória praticamente não mudou. Um único _kilobyte_ extra foi necessário para armazenar o novo array de 20 KBs. Como?

## Copy on Write - PHP ao resgate

O PHP entende que arrays são uma estrutura de dados muito comum, muito utilizada e muito poderosa. Por isso, há uma técnica bastante comum implementada por baixo dos panos nos _arrays_ do PHP: _Copy on Write_, ou, no bom e velho português, cópia somente no momento da escrita.

O que isso quer dizer é que, ao realizar uma "cópia" de um array, ou seja, ao passar um array por parâmetro ou atribuí-lo a outra variável, o PHP não realiza uma cópia nos dados em memória. Ele, na verdade, faz com que esse parâmetro ou variável apontem para o mesmo endereço de memória do array original, nos poupando muita memória, principalmente em cenário de grandes volumes de dados.

Porém, se ambos apontam para o mesmo endereço de memória, isso significa que ao manipular os itens desse novo array, eu acabaria alterando o array original também, certo? Errado. Daí que vem o nome da técnica de _copy on write_. Ao tentar realizar alguma manipulação nos dados dessa "cópia", só então os dados serão efetivamente copiados. Sendo assim, podemos ver o aumento no uso de memória com o seguinte trecho de código:

```php
// ...
$copiaDoArray[1] = 'Outro valor';
echo (memory_get_usage() - $memoriaInicial) / 1024;
```

Agora, após modificar a variável `$copiaDoArray`, uma cópia dos dados em memória será realmente feita, então o uso de memória finalmente dobrará e veremos um uso de aproximadamente 42KB.

## Conclusão

_Arrays_ são extremamente versáteis e poderosos no PHP e por isso são amplamente utilizados (às vezes até mal utilizados). Pensando nisso, o PHP faz de tudo para que seu uso seja o mais otimizado possível, e garantir que cópias desnecessárias sejam evitadas nos poupa **muita** RAM.

Se você quiser aprender mais sobre as "entranhas" do PHP, manipulação de memória, otimização além de boas práticas, lá na Alura eu tenho vários cursos sobre o assunto (e sobre outros temas também). Aqui tem um [cupom de 15% desconto](https://tidd.ly/4d42Myb) para você aproveitar a plataforma.
