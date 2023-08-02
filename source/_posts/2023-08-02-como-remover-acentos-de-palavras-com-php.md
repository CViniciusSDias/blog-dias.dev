---
title: "Como remover acentos de palavras com PHP"
date: "2023-08-01"
description: "Remover acentos de palavras usando PHP é uma tarefa bastante comum, principalmente para gerar _slugs_ ou links amigáveis. Entenda nesse texto como você pode usar PHP para remover acentos de textos."
tags: ["PHP", "acentos", "string" , "normalização", "Dias de Dev"]
categories: ["PHP"]
---

Remover acentos de palavras usando PHP é uma tarefa bastante comum, principalmente para gerar _slugs_ ou links amigáveis. Nesse texto nós vamos aprender a utilizar a extensão _intl_ para realizar essa tarefa com 2 simples linhas de código.

### TL;DR Me mostre logo o código

```php
<?php

$string = 'Ãéïòû';

$normalized = Normalizer::normalize($string, Normalizer::NFD);
echo preg_replace('/[\x{0300}-\x{036F}]/u', '', $normalized); // Exibe: Aeiou

```

O código PHP acima remove os acentos, logo, o texto `Ãéïòû` vai se tornar `Aeiou`. Agora vamos entender o que o código faz.

## Normalização de texto

A primeira parte desse simples algoritmo consiste em **normalizar** o texto. Normalizar um texto consiste em transformá-lo de alguma forma pré-determinada, seguindo algumas normas ou regras.

O código acima pega a string `"Ãéïòû"` e a normaliza utilizando a forma de normalização D (`NFD`), conhecida também como decomposição canônica (_Canonical Decomposition_). Essa regra consiste em separar os caracteres de acentuação dos demais, ou seja, caracteres como crase (\`) ou til (~) são separados das letras. O caractere `Ã`, por exemplo, se torna `A~`.

Essa forma de normalização foi definida e nomeada pelo [_Unicode Consortium_](/2021-08-24-charsets-e-encodings-como-strings-funcionam/), mas não é a única. Você pode conferir mais detalhes sobre cada uma das "regras" no site oficial: <https://unicode.org/reports/tr15/>.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

### Extensão PHP

Tendo entendido o que é normalizar um texto, como é possível atingir esse objetivo com PHP? Através de uma [extensão](/2022-02-13-extensoes-php/) externa chamada `intl`.

Essa extensão fornece acesso a uma biblioteca famosa chamada _ICU (International Components for Unicode)_, que traz diversas operações referentes a _locale_. O termo _locale_ em inglês não tem uma boa tradução (pelo menos eu não conheço), mas basicamente se refere a informações como formatos de data e hora, moedas, textos, etc. Repare que não é apenas relacionado ao idioma, mas tudo que envolve formatos internacionais.

A extensão `intl` traz, dentre várias outras, a classe `Normalizer` que tem como único propósito realizar a normalização de textos. Com isso, o código a seguir separa cada caractere de seu respectivo acento, caso haja algum:

```php
$normalized = Normalizer::normalize('Ãéïòû', Normalizer::NFD);
```

Isso vai devolver uma string com o conteúdo semelhante ao seguinte: ``A~e´i¨o`u^``. "Semelhante" porque os caracteres individuais e separados de acentos (como o `^`) não são os mesmos que vemos quando são adicionados a uma letra, então o real caractere não vai ser visível de forma individual ao tentar exibir a string resultante. Mas nós não queremos exibir a string normalizada, e sim manipulá-la. E é justamente sobre essa manipulação que vamos falar agora.

## Expressão regular

Após separar os caracteres de seus respectivos acentos, a tarefa de remover os acentos se torna bastante simples. Basta utilizarmos uma expressão regular (a temida _regex_) para remover qualquer caractere que seja um acento. Os caracteres com código _Unicode_ entre U+0300 e U+036F são acentos, logo, podemos removê-los com o seguinte código:

```php
preg_replace('/[\x{0300}-\x{036F}]/u', '', $normalized);
```

O modificador `/u`, ao final da _regex_, indica ao PHP que estamos trabalhando com UTF-8 nessa expressão regular, o que nos permite utilizar `\x`, que é o que nos dá o poder de identificar os caracteres _Unicode_.

Isso garante não haver alteração da string original, mantendo números, caracteres especiais, etc. Claro que você pode mudar a expressão regular para remover tudo que não sejam letras, números e espaços, por exemplo. O código ficaria assim:

```php
preg_replace('/[^a-zA-Z0-9\s]/', '', $normalized);
```

O código acima é geralmente utilizado para gerar URLs amigáveis, ou os famosos _slugs_. Mas após entender o processo de normalização, modificar a _regex_ para atingir objetivos diferentes e mais específicos se torna uma tarefa trivial.

## Conclusão

Embora seja uma tarefa bastante comum, remover acentos com PHP pode não parecer tão fácil quando uma rápida pesquisa é feita na internet. Diversas listas enormes de caracteres a serem substituídos são sugeridas, dentre outras práticas ainda mais "questionáveis".

O simples uso de uma extensão apropriada faz com que essa complexa tarefa seja imensamente facilitada. Recomendo acessar os links que deixei durante o post como referência para se aprofundar em cada um dos assuntos aqui abordados.

Já no link a seguir eu deixo um cupom de 10% de desconto para você assinar a Alura, plataforma onde há cursos completos (alguns comigo, inclusive) sobre manipulação de strings (dentre vários outros assuntos de tecnologia):
<https://alura.tv/diasdedev>
