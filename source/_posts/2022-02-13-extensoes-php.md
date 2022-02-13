---
title: "Extensões PHP"
date: "2022-02-13"
description: "PHP é uma linguagem de programação que permite o uso e criação de extensões. Conheça neste artigo o que são extensões PHP"
tags: ["PHP", "Extensões PHP", "Dias de Dev"]
categories: ["PHP"]
---
PHP é uma linguagem de programação que roda em uma espécie de "máquina virtual" chamada _Zend Engine_. Essa máquina
virtual é escrita em C e permite que nós escrevamos código em C para embutir funcionalidades no PHP. Assim funcionam as
extensões do PHP.

## O que são extensões do PHP?

As extensões no PHP são códigos escritos em C que são, de certa forma, embutidos na linguagem, logo, se parecem com código
nativo. É possível criarmos novas funções, classes e até criar sintaxe nova na linguagem a partir de extensões.

Quem usa PHP no dia-a-dia com certeza usa alguma extensão. Alguns exemplos de extensões PHP bem comuns:

- PDO
- Sessions
- JSON
- cURL

## Tipos de extensões

Além de existir um número enorme de extensões do PHP, existem também alguns tipos onde elas podem ser categorizadas.
Estes tipos são: _Core Extensions_, _Bundled Extensions_, _External Extensions_ e _PECL Extensions_.

### Core Extensions

As extensões _Core_, como o nome já diz, fazem parte do _core_ (núcleo) do PHP. O PHP não existe sem elas e é impossível
ter uma instalação do PHP sem estas. Alguns exemplos deste tipo de extensões são: Arrays, Classes/Objects, Date/Time,
JSON, OPCache etc.

Estas extensões são mantidas pela própria equipe do PHP já que fazem parte da linguagem em si.

### Bundled Extensions

As extensões empacotadas com o PHP, chamadas de _bundled extensions_, são extensões que já vêm junto com o PHP, mas é
possível escolher habilitá-las ou não em sua instalação. Estas extensões também são mantidas pela equipe do PHP já que
são empacotadas junto com o restante do código da linguagem.

Alguns exemplos de extensões deste tipo: PDO, GD, FFI, intl, Sessions etc.

### External Extensions

As extensões externas são idênticas às _bundled_ em quase todos os aspectos. Elas vêm com o PHP, podem ser habilitadas
ou não e são mantidas pela equipe do _core_, porém possuem uma diferença: elas possuem dependências externas.

Para ter este tipo de extensão em sua instalação do PHP você vai precisar ter alguma outra biblioteca ou programa em seu
sistema operacional. A extensão _cURL_, por exemplo, entra nessa categoria. Para ter essa extensão no PHP você precisa
do software _cURL_ instalado no sistema, já que a extensão faz uso do código disponibilizado por este software.

Alguns exemplos de extensões externas são: cURL, DOM, OpenSSL, Sodium, Zip etc.

### PECL Extensions

Por último nós temos as extensões disponibilizadas por terceiros usando _PECL_, que é basicamente um repositório para
extensões PHP, como se fosse o _Packagist_ de extensões. Se você pretende criar uma extensão para o PHP, vai utilizar
este repositório.

As extensões desta categoria são mantidas por terceiros e podem ou não possuir dependências externas. Nem todas as
extensões desta categoria estão no manual da linguagem, afinal de contas é possível que qualquer pessoa crie uma
extensão.

Alguns exemplos interessantes de extensões disponibilizadas através do _PECL_: DS (Data Structures), EV, Memcached,
Parallel, Swoole etc.

## Referências

Conhecer todas extensões do PHP é simplesmente impossível, mas conhecer bem algumas extensões mais importantes para seu
dia-a-dia é de extrema importância.

[Aqui](https://www.php.net/manual/en/extensions.membership.php) você pode conferir a lista completa de extensões do
manual do PHP, todas classificadas por categoria.

Se você tiver interesse em criar suas próprias extensões, existem alguns materiais interessantes disponíveis (embora
não seja uma tarefa tão trivial). No tutorial _[How do I](https://flavioheleno.github.io/how-do-i/)_ do Flavio Heleno
você pode conferir o início dessa jornada de criação de extensões além de conferir outras referências.

## Conclusão

A linguagem de programação PHP é escrita em C e possui diversas extensões que fazem parte ou não da linguagem. Nós
fazemos uso de várias extensões no dia-a-dia e entender este funcionamento é bastante importante para devs PHP.

Se além de entender sobre algumas extensões você quiser aprender mais sobre PHP em si, você pode usar esse
[cupom](https://www.alura.com.br/promocao/diasdedev) que fornece 10% de desconto na assinatura da Alura, plataforma onde
eu mesmo gravei diversos cursos sobre o assunto.
