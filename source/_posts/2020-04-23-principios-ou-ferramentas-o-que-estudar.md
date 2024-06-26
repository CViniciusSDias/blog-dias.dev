---
title: "Princípios ou Ferramentas - O que estudar"
date: "2020-04-23"
description: "O início no mundo de desenvolvimento não é fácil. Estudar um framework específico, uma ou várias linguagens? Nesse artigo eu comento sobre práticas e princípios a se estudar"
tags: ["Estudo", "Programação", "Linguagens de programação", "Frameworks", "Dias de Dev"]
categories: ["Conceitos"]
video: true
---
## O mundo de desenvolvimento

Quando decidimos entrar para o mundo de desenvolvimento, sofremos um bombardeio de informações e novos termos.

Linguagens, frameworks, bibliotecas, paradigmas, princípios, etc. Não é fácil saber que caminho seguir e o que estudar primeiro.

Obviamente não existe alternativa certa ou errada, então nesse post eu vou somente expor minha opinião. Não tome o que for dito aqui como verdade, mas sim reflita e analise se faz sentido para você.

## Mercado de trabalho

É inegável que para atuar no mercado de trabalho nós precisamos de muito mais conhecimento do que nos é passado inicialmente em qualquer livro, curso ou post de blog. Somente a experiência e vivência vão nos dar a bagagem necessária para resolver os problemas e gerar valor para os clientes.

Mas isso não quer dizer que nós só devamos estudar o que o emprego atual nos pede. Pelo contrário. Se nós estudamos além do que nos é pedido, ou no caso do primeiro emprego, estudamos antes de algo nos ser cobrado, quando uma oportunidade ou problema surgir, as chances serão muito maiores de estarmos prontos.

Além de solucionar os problemas ou aproveitar as oportunidades, estudar nos faz conhecer melhores formas de atingir estes objetos, nos dando vantagens competitivas sobre quem simplesmente "resolve o problema".

Ok, até aqui só usei o termo "estudo", mas devemos estudar o que? Ferramentas específicas ou princípios genéricos que podem ser aplicados a várias ferramentas?

## Linguagens, bibliotecas e frameworks

Se você quer entrar para a área de desenvolvimento e acredita que seu trabalho vai ser escrever código, você está enganado(a). O nosso trabalho é solucionar problemas. Código é uma ferramenta, um meio para o fim. Linguagens de programação são apenas ferramentas para nós resolvermos determinados problemas. Frameworks e bibliotecas nada mais são do que ferramentas de "alto nível", que nos trazem algumas facilidades e alguns problemas genéricos já resolvidos.

Ah, Vinicius, quer dizer que a escolha da linguagem de programação não é importante? Longe disso! A linguagem de programação é uma ferramenta muito importante para a solução do problema e existem linguagens diferentes para solucionar problemas diferentes. O ponto é: elas são ferramentas.

Se nós tivermos isso em mente, acabamos deixando de lado aquele tipo de briga de "minha linguagem é melhor que a sua" ou "meu framework é melhor do que o seu". Discussões desse tipo são interessantes e até emocionantes (eu mesmo adoro falar mal de Laravel ;-p), mas nós não podemos nos cegar achando que realmente há uma ferramenta melhor do que outra e ponto.

**Não existe bala de prata** (solução pra qualquer problema)!

Assim como cada linguagem resolve um problema, cada framework tem um propósito, uma identidade. Você vai acabar se identificando mais com um ou outro, mas não faça com que isso seja o foco de todo o seu estudo e trabalho. Conhecer muito bem a linguagem e o framework que você utiliza para trabalhar é importante, mas é o primeiro passo?

## Paradigmas

Como eu citei no último parágrafo, "cada linguagem resolve um problema", e cada linguagem faz isso de um jeito. Existem diversos paradigmas de programação, dentre eles:

- Declarativos
    - Programação funcional
- Imperativos
    - Programação procedural
    - Programação orientada a objetos

Entender bem as vantagens e desvantagens de cada paradigma e as diferenças entre eles é crucial para aprender qualquer linguagem de programação. Diversas linguagens modernas são o que chamamos de "multi-paradigma", ou seja, nos permitem utilizar mais de um paradigma em nosso código, como procedural e Orientado a Objetos, funcional e Orientado a objetos, funcional e procedural, etc.

Este post (em inglês) fala com bem mais de detalhes sobre os principais paradigmas de programação e alguns exemplos de linguagens:

https://dev.to/vplentinax/classification-of-computer-languages-ii-2201

Se você (assim como eu) prefere vídeos, pode conferir este aqui:

<lite-youtube videoid="asFnD-JLFWs" style="background-image: url('https://i.ytimg.com/vi/asFnD-JLFWs/hqdefault.jpg');">
    <a href="https://youtube.com/watch?v=asFnD-JLFWs" class="lty-playbtn" title="Reproduzir vídeo">
        <span class="lyt-visually-hidden">Reproduzir vídeo: Paradigmas de Programação | Programando com Vinicius Dias</span>
    </a>
</lite-youtube>

## Princípios

Cada paradigma de programação (e suas respectivas linguagens suportadas) sugerem diversos princípios para que seu código seja de fácil manutenção, testável, legível, etc.

Princípios muito comuns da programação orientada a objetos (paradigma que estudo mais a fundo) são:

- [Tell, don't ask](https://youtube.com/watch?v=7IXeLhpjk6g);
- Least astonishment;
- *[Fail fast](https://youtube.com/watch?v=6mfX6863SAk);
- *Early return;
- [SOLID](https://amzn.to/3Eplrm2) (conjunto de princípios);
- etc.

_* Princípios também aplicáveis a outros paradigmas_

Estudar os princípios referentes ao paradigma que você escolher é fundamental para manter seu código saudável. Não aplicá-los pode dar a falsa impressão de que você está sendo mais produtivo(a), mas a longo prazo a verdade sempre surge e nós acabamos nos arrependendo.

## Padrões

Tendo entendido o que são paradigmas e que cada um deles possui princípios, baseando-se nestes princípios surgem padrões. Os famosos _Padrões de Projeto_ são basicamente soluções padrões para problemas genéricos. São sugestões de como proceder em determinadas situações.

Certos problemas são tão comuns de acontecer, que pessoas através dos anos já estudaram e discutiram muito sobre as melhores formas de resolvê-los.

Alguns dos padrões mais famosos seguindo os princípios da programação orientada a objetos são:

- [Padrões da "turma dos 4" (_Gang of Four "GoF"_)](https://amzn.to/3pIqBDR)
    - 24 padrões (super famosos) separados em 3 categorias
- [Object calisthenics](https://youtube.com/watch?v=z4fxFU5MoAA)
    - 9 regras para exercitar em seus códigos
- [Sugeridos pelo "desenvolvimento guiado a domínio" (_DDD_)](https://amzn.to/3ojA9Wf)
    - Conhecidos como blocos de construção do _DDD_ como _Entity_, _Value Object_, etc.

Como citado no início do capítulo, cada padrão visa resolver problemas bem comuns e genéricos, e devem ser aplicados quando fazem sentido. Os padrões exemplificados estão em níveis bem diferentes de sua aplicação e explicá-los individualmente é impossível através de um único post.

## O que estudar primeiro?

Como foi dito lá no início, esse post é para que eu expressar **minha opinião**.

Na minha visão, devemos estudar o básico dos paradigmas de programação, entendendo qual problema cada um resolve e em que casos são usados. Após entendê-los, normalmente nos aprofundamos em 1 deles, mas existe um porém:
Antes de aprender Orientação a Objetos, é importante conhecermos o paradigma procedural, visto que o primeiro surgiu para resolver determinados problemas do último.

Para estudar um dos paradigmas, obviamente precisamos de uma linguagem de programação, então este estudo acontece em paralelo: Conhecemos uma linguagem enquanto conhecemos um paradigma.

Após dominar razoavelmente bem os conceitos da linguagem e do paradigma em questão, podemos começar a estudar os princípios sugeridos, entendendo suas propostas, quais problemas resolvem, porque surgiram, etc.

Estes princípios, normalmente nos levam naturalmente para o estudo de alguns padrões. O estudo de padrões já é um estudo mais avançado, porém muito recompensante.

Se você tem um bom conhecimento de um paradigma (e consequentemente, uma linguagem), alguns de seus princípios e padrões, pode ser o momento de aprender a utilizar ferramentas que auxiliem no processo.

Frameworks e bibliotecas são ferramentas que facilitam a resolução de problemas **que você deveria saber resolver sem elas**. Richard Feynman, ganhador do Nobel de física, escreveu uma vez: “What I cannot create I do not understand”. Traduzindo: "O que eu não consigo criar eu não entendo".

Então antes de utilizar um framework, saiba resolver o problema sem ele. Antes de utilizar uma biblioteca mais específica, saiba resolver o problema sem ela. Isso faz com que você consiga resolver um problema nas ferramentas, caso aconteça.
