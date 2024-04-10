---
title: "Strings multibyte: o que são e por que você precisa da extensão mbstring do PHP"
date: "2023-03-21"
description: "Entenda o que são strings multibyte em PHP e como a extensão mbstring pode te ajudr a lidar com caracteres acentuados em suas operações de strings."
tags: ["PHP", "mbstring", "strings multibyte", "caracteres acentuados"]
categories: ["PHP"]
video: true
---

_Strings multibyte_ são textos que possuem alguns caracteres que demandam mais de um _byte_ para serem representados. Há um post aqui no blog onde nós falamos sobre [Charsets e Encodings: Como strings funcionam](/2021-08-24-charsets-e-encodings-como-strings-funcionam/). Agora nós vamos entender como lidar com _strings multibyte_ em PHP usando a [extensão](/2022-02-13-extensoes-php/) `mbstring`.

## Operações em strings

Quando trabalhamos com textos, é bastante comum precisarmos realizar algumas operações. Transformar todas as letras em maiúsculas ou minúsculas, por exemplo, é uma operação corriqueira. Até operações mais simples como contar o número de caracteres podem nos trazer algumas dores de cabeça se estivermos trabalhando com _strings multibyte_.

Um exemplo bastante simples:
```php
<?php

echo strlen('Olá'); // Exibe 4
echo strtoupper('olá'); // Exibe "OLá"
```




## Strings multibyte

Como foi exposto logo na introdução do post, uma _string multibyte_ é um texto que possui caracteres que demandam mais de um _byte_ para serem representados. Caracteres com acento são um ótimo exemplo desse cenário. É necessário mais de um _byte_ para representá-los, já que em um único _byte_ nós conseguimos representar apenas 256 caracteres, que são, não coincidentemente, os caracteres da tabela _ASCII_.

As funções padrão de _strings_ do PHP lidam assumindo que cada caractere da _string_ possui um _byte_, por isso a contagem de caracteres é inválida com `strlen` e por isso que **funções como `strtoupper` ou `strtolower` não conseguem modificar os caracteres acentuados**.

## Extensão mbstring

Como nós cotidianamente trabalhamos com _strings_ que contenham caracteres fora da tabela _ASCII_, obviamente o PHP não nos deixaria desamparados nessa situação. Para realizar operações em _strings multibyte_ nós podemos usar a extensão `mbstring`. Nós já falamos sobre [extensões PHP](/2022-02-13-extensoes-php/) aqui no blog, então vou partir do princípio que você já possui familiaridade com o assunto.

A extensão `mbstring` nos fornece diversas funções que possibilitam a manipulação de _strings multibyte_, indo de operações simples como contar o número de caracteres de uma string até operações mais complexas como **converter o encoding de uma string**.

A maioria das funções "padrão" de _strings_ do PHP possui uma contraparte na `mbstring`, sendo apenas prefixada com `mb_`. O exemplo de código anteriormente exposto que nos gerava o resultado inesperado poderia ser escrito da seguinte forma:
```php
<?php

echo mb_strlen('Olá'); // Exibe 3
echo mb_strtoupper('olá'); // Exibe "OLÁ"
```

Além disso, se eu possuo uma _string_ que está no _encoding_ `ISO-8859-1` ou `WINDOWS-1252`, eu posso converter facilmente para UTF-8 com o seguinte código:

```php

echo mb_convert_encoding('string em ISO-8859-1', 'UTF-8', 'ISO-8859-1');
```

## `utf8_encode` e `utf8_decode`

Quem me acompanha já sabe que as funções `utf8_encode` e `utf8_decode` serão marcadas como **obsoletas** no PHP 8.2. Quem ainda não sabia disso pode conferir o vídeo a seguir:

<lite-youtube videoid="al47Lz_SWLc" style="background-image: url('https://i.ytimg.com/vi/al47Lz_SWLc/hqdefault.jpg');">
    <a href="https://youtube.com/watch?v=al47Lz_SWLc" class="lty-playbtn" title="Reproduzir vídeo">
        <span class="lyt-visually-hidden">Novidades do PHP 8.2: Descontinuação de utf8_encode e utf8_decode | Dias de Dev</span>
    </a>
</lite-youtube>

Como foi explicado no vídeo, essas funções serão descontinuadas já que são confusas e o uso de `mbstring` é uma opção válida para chegar ao mesmo resultado. A seguir você pode conferir como seria realizada a conversão das _strings_ sem as famosas funções de `utf8_`:

```php
<?php

// Equivalente a utf8_encode('string em ISO-8859-1');
echo mb_convert_encoding('string em ISO-8859-1', 'UTF-8', 'ISO-8859-1');

// Equivalente a utf8_decode('string em UTF-8');
echo mb_convert_encoding('string em UTF-8', 'ISO-8859-1', 'UTF-8');
```

## Conclusão

Tendo entendido o conceito de _strings multibyte_, fica bastante claro tanto o papel da extensão `mbstring` quanto vários problemas que nós já enfrentamos ao manipular caracteres acentuados, por exemplo.

Se você quiser aprender mais sobre manipulações de strings, encodings, charsets, PHP e mais assuntos relacionados a tecnologia, aqui está um [cupom de desconto](https://tidd.ly/4d42Myb) para assinar a Alura, plataforma de cursos online onde eu sou o instrutor da maioria dos cursos de PHP.
