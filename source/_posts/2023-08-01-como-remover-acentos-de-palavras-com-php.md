---
title: "Como remover acentos de palavras com PHP"
date: "2023-08-01"
description: "Remover acentos de palavras usando PHP é uma tarefa bastante comum, principalmente para gerar slugs ou links amigáveis. Entenda nesse texto como você pode usar PHP para remover acentos de textos."
tags: ["PHP", "acentos", "string" , "normalização", "Dias de Dev"]
categories: ["PHP"]
---

_Edit: [Neste comentário](https://www.linkedin.com/feed/update/urn:li:activity:7092531957842026499/) o Wanderson me apontou outra solução para resolver o mesmo problema, então estou adicionando-a ao início do post._

## Extensão iconv

```php
<?php

$string = 'Ãéïòû';
echo iconv('UTF-8', 'ASCII//TRANSLIT', $string); // Exibe: Aeiou
```

O código PHP acima remove os acentos, logo, o texto `Ãéïòû` vai se tornar `Aeiou`. Esse trabalho é realizado pela [extensão](/2022-02-13-extensoes-php/) `iconv` que vem instalada por padrão no PHP. Ela permite a conversão entre _[encodings](/2021-08-24-charsets-e-encodings-como-strings-funcionam/)_.

Ao converter uma string para _ASCII_, nós podemos escolher ignorar os caracteres não existentes nesse _charset_ ou realizar uma transliteração (mapeamento) dos caracteres que não fazem parte da tabela para o mais próximo possível. Para isso, utilizamos o sufixo `//TRANSLIT` ao segundo parâmetro. Isso transforma, por exemplo, o caractere `Ã` em `A`.

Essa abordagem vai funcionar na maioria dos cenários, mas há algumas observações que devem ser consideradas.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

### Locale

A conversão com `iconv` não vai funcionar caso a categoria `LC_CTYPE` do `locale` esteja definida como `C` ou `POSIX`.

Exemplo:
```php
<?php

setlocale(LC_CTYPE, 'POSIX');
echo iconv('UTF-8', 'ASCII//TRANSLIT', 'Ãéïòû'); // Exibe ?????
```

### Implementação do iconv

Outro problema é que o sufixo `//TRANSLIT` tem seu funcionamento dependente da implementação do `iconv` que seu sistema operacional possui. Algumas implementações são conhecidas por ignorar `//TRANSLIT`, então a conversão provavelmente falhará.

Para esses cenários uma de suas opções é instalar outra implementação do `iconv`. Você pode verificar qual a implementação do seu sistema operacional lendo o conteúdo da constante `ICONV_IMPL`. A implementação `glibc` é segura e funciona conforme exemplificado nesse post.

### Solução

Caso você, por algum motivo, não possa alterar o `locale` em seu servidor e o padrão for `C` ou `POSIX`, a solução descrita não é válida para seu caso. Se sua implementação do `iconv` no sistema operacional for uma incompatível com `//TRANSLIT` e você não puder ou preferir não instalar outra implementação, essa dica também não foi para você.

Uma solução para os problemas previamente citados é utilizar outra abordagem, com outra extensão. Para estes raros cenários, deixo a seguir o conteúdo original desse post, onde mostro como utilizar a normalização de strings com PHP para remover acentos.

## Post original

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
