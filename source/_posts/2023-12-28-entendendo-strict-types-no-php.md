---
title: "PHP Strict Types: Entendendo o Uso Prático da Diretiva declare(strict_types=1) no PHP"
date: "2023-12-28"
description: "Descubra o verdadeiro impacto da diretiva declare(strict_types=1) no PHP. Este guia prático explora de maneira simples e direta como essa diretiva influencia o comportamento do seu código, assegurando integridade e segurança."
tags: [
    "PHP Strict Types",
    "declare strict_types",
    "Type Hints",
    "Type Juggling",
    "Segurança em Programação",
    "Boas Práticas PHP",
    "TypeError PHP",
    "Desenvolvimento PHP",
    "Tipos de Dados PHP"
]
categories: ["PHP"]
---

A diretiva `declare(strict_types=1)` é amplamente utilizada no PHP, mas nem todos entendem o que ela faz na prática. Nesse texto nós vamos entender como o comportamento do seu código pode ser alterado ao usar essa diretiva.

## Type hints no PHP

O PHP possui o conceito de _Type Hints_ que é basicamente como nós podemos informar os tipos que usaremos em alguns locais como em parâmetros e retornos de funções. Ao informar o tipo de um parâmetro, por exemplo, o PHP irá verificar se o valor passado é compatível com o tipo informado. Por exemplo:

```php
function soma(int $a, int $b): int
{
    return $a + $b;
}

soma('test 1', 'test 2'); // Fatal error: Uncaught TypeError: Argument 1 passed to soma() must be of the type int, string given
```

Repare que ao tentar passar uma string para uma função que espera inteiros, um erro do tipo `TypeError` é lançado. Esse tipo de técnica traz mais segurança para nosso código de forma que conhecemos melhor os valores que manipulamos.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## Malabarismo com tipos

Embora o PHP possua os famosos e muito úteis _type hints_, é importante dizer que nem sempre eles são seguidos à risca. O PHP possui outro conceito chamado _type juggling_ (malabarismo de tipos em tradução livre) que é basicamente a conversão de tipos de forma implícita. Essa funcionalidade permite algumas facilidades bem interessantes, principalmente quando nos lembramos que o protocolo HTTP trabalha somente com texto. Se nós recebessemos os dois números para realizar a soma por uma requisição, eles viriam como `string`s, então o seguinte código seria executado:
    
```php
soma('1', '2'); // 3
```

Embora ainda estejamos passando strings por parâmetro, agora a chamada da função é bem sucedida. Isso acontece, pois o PHP possui algo chamado [strings numéricas](https://www.youtube.com/watch?v=sKw-ruVP9cw). O exemplo anterior é um caso onde a conversão automática dos tipos nos ajuda, porém há casos onde isso pode ser um problema. Se nós tentarmos passar números com ponto flutuante, por exemplo, o PHP irá remover a parte decimal dos números:

```php
soma(1.5, 2.5); // 3
```

Desde a versão 8.1 o PHP emitirá um aviso de obsolência (_deprecation notice_) quando tentamos converter `float` para `int`, mas ainda assim o código é executado e o resultado é no mínimo inesperado (para não dizer incorreto).

## Impedindo conversões

Para impedir esse comportamento do PHP, nós podemos usar a diretiva `declare(strict_types=1)` que irá forçar o PHP a seguir os _type hints_ de forma mais rígida, sem conversões implícitas de tipos. Ao usar essa diretiva, o PHP irá lançar um erro do tipo `TypeError` quando tentarmos passar um tipo diferente do esperado, mesmo que seja possível realizar alguma conversão. Sendo assim, se onde eu chamo a função `soma` houver a declaração de `strict_types`, o código lançará um erro:

```php
<?php

declare(strict_types=1);

function soma(int $a, int $b): int
{
    return $a + $b;
}

soma('1', '2'); // Fatal error: Uncaught TypeError: Argument 1 passed to soma() must be of the type int, string given
soma(1.5, 2.5); // Fatal error: Uncaught TypeError: Argument 1 passed to soma() must be of the type int, float given
```

Um detalhe muito importante é que a diretiva `declare(strict_types=1)` deve ser declarada no início do arquivo, antes de qualquer código.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## Múltiplos arquivos

A diretiva `declare` agirá no arquivo onde ela for declarada, então pode acontecer de termos um arquivo com `strict_types=1` e outro sem. Nesse cenário, o PHP vai se comportar seguindo o que for declarado no arquivo que **chama** a função e não no arquivo que a declara. Exemplo:

```php
<?php
// arquivo functions.php

declare(strict_types=1);

function soma(int $a, int $b) {
    return $a + $b;
}
?>

<?php
// arquivo index.php

require_once 'functions.php';

echo soma('1', '2'); // 3
?>
```

Repare que mesmo o arquivo `functions.php` possuindo a diretiva, o arquivo que executa a função é o `index.php` e ele não informa a diretiva, logo, ela estará desabilitada. Já no caso contrário, o seguinte ocorrerá:

```php
// arquivo functions.php

function soma(int $a, int $b) {
    return $a + $b;
}
?>

<?php
// arquivo index.php

declare(strict_types=1);

require_once 'functions.php';

echo soma('1', '2'); // Fatal error: Uncaught TypeError: Argument 1 passed to soma() must be of the type int, string given
?>
```

Mesmo o arquivo `functions.php` não informando a diretiva `declare(strict_types=1)` o erro acontece, pois no arquivo `index.php` é onde a chamada acontece e ele possui a diretiva. 

## Conclusão

Tipos em PHP podem ser um assunto espinhoso porque além de complexo, nem todo dev concorda em como utilizá-los. Uns (como eu) acreditam que quanto mais estrito, melhor. Outros acreditam que _type hints_ são um desperdício. Mais uma coisa eu acredito que seja unânime: é muito importante para nós, como devs PHP, entender como os tipos funcionam na linguagem com a qual trabalhamos.

Se você deseja explorar ainda mais o tema de tipos em PHP, recomendo a leitura de um artigo abrangente no blog Codamos. O conteúdo discute detalhadamente os diversos tipos em PHP, suas manipulações e conversões, e oferece uma análise mais aprofundada sobre `strict_types`, inclusive com trechos de código em C do PHP. Para acessar o artigo completo, visite [este link](https://codamos.com.br/tipos-em-php/). E se você quiser aprender mais sobre PHP, há **muitos** cursos gravados por mim lá na Alura. Aqui tem um cupom de 10% de desconto para assinar a plataforma: <https://alura.tv/diasdedev>
