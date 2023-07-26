---
title: "PHP além da Web"
date: "2020-10-27"
description: "Embora o PHP tenha nascido na Web e para a Web, é possível usar o PHP além da Web."
tags: ["PHP", "PHP fora da web", "PHP Além da web", "Dias de Dev"]
categories: ["PHP"]
---
## PHP + Web = <3

Não é nenhum segredo que o PHP nasceu na web e para a web. Seu propósito inicial era servir páginas dinâmicas de forma simples e amigável, mas a Web evoluiu e o PHP também. Hoje em dia o PHP é uma linguagem de programação completa e pronta para ser executada nos mais diversos ambientes, e não só na Web.

### Web além do HTML

Antes de sair da Web, acredito que seja muito importante citar que nem só de HTML vive a Web. É mais do que comum vermos URLs gerando dados nos mais diversos formatos como XML, JSON, etc. Você provavelmente conhece isso como API, correto? Obviamente o PHP está mais do que preparado para este tipo de trabalho e de forma muito simples. A ideia desse artigo é trazer as possibilidades realmente fora da Web.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## Por que usar PHP fora da web?

Antes de vermos as possibilidades, por que eu iria fazer isso? Se o PHP nasceu na Web, por que não mantê-lo lá? Bom, existem diversos motivos para trazermos o PHP para demais ambientes, mas acredito que o mais óbvio e o principal é a equipe. Se nós já temos uma equipe de pessoas que desenvolvem em PHP na Web, por que não utilizar esse conhecimento também fora da Web para processamento de dados assíncronos, leitura de filas, cronjobs, scripts da CLI em geral, etc? É justamente sobre essas possibilidades que quero tratar nesta publicação.

## Existe vida além da Web?

Agora que já entendemos o motivo de possivelmente utilizar PHP fora da Web, vamos falar sobre... o que seria esse "fora da Web". Em uma equipe de desenvolvimento Web, o que poderia estar fora da Web para nós precisarmos utilizar PHP?

### Processos assíncronos

Uma requisição web deve acontecer da forma mais rápida possível para que o usuário/cliente não fique esperando uma resposta, e uma das técnicas muito conhecidas para evitar essa espera é tornar alguns processos assíncronos.

Se ao cadastrar um usuário no banco de dados nós precisamos enviar um e-mail, por exemplo, não há necessidade de fazê-lo esperar até nós conseguirmos enviar este e-mail para só depois entregar a resposta. Nós podemos armazenar em algum lugar a informação de que um e-mail deverá ser enviado, e fazer isso depois, fora da web, sem que o usuário fique esperando.

Existem inúmeras formas de atingir este objetivo. Uma das mais comuns é através de filas de processos. Nós armazenamos as informações sobre o processo que deve ser executado em algum local específico para isso, e futuramente, fora da web, recuperamos esta informação para processá-la. Banco de dados, mensagerias, onde for. O importante é que a tarefa demorada não faça com que o usuário nos espere.

### Scripts CLI

Um cenário também muito comum, principalmente em empresas de médio e grande porte, é ter processos que devem ser executados periodicamente de forma manual ou automatica. Sincronização de dados, processamento de informações, o que for... Essas tarefas não precisam ser executadas em um ambiente web, e normalmente são executadas na linha de comando. Os processos automáticos são conhecidos como _cronjobs_ ou tarefas agendadas. Já os processos executados manualmente são simples scripts ou programas de linha de comando (CLI).

O PHP é um executável capaz de rodar na linha de comando e não há dificuldade nenhuma em utilizá-lo para estes casos. Inclusive há diversos recursos da linguagem que nos permitem acessar detalhes interessantes deste novo mundo fora da grande rede mundial.

#### Features fora da web

Com PHP nós conseguimos ler parâmetros da linha de comando através de variáveis "mágicas" como [$argv](https://php.net/argv) e [$argc](https://php.net/argc). Isso nos permite interatividade de forma semelhante ao que a Web nos traria com formulários, parâmetros via URL, etc.

Além de argumentos, podemos receber algumas opções para personalizar a execução de nossos códigos. A função [getopt](https://php.net/getopt) consegue nos ajudar a fazer isso de forma simples e profissional, exatamente como os mais famosos comandos que estamos habituados a utilizar já fazem.

### Ferramentas

O mundo de componentes PHP é fantástico. Temos ferramentas mágicas como Symfony para criar aplicações Web, Doctrine para acessar o banco de dados com mais facilidade, PHPUnit para realizar testes automatizados... Mas será que existem ferramentas específicas para facilitar nosso mundo fora da Web? A resposta felizmente é SIM!

#### Criação de programas

O próprio Symfony possui uma das ferramentas mais conhecidas para criação de programas na CLI: O [Symfony Console](https://symfony.com/doc/current/components/console.html). Com ele nós podemos criar aplicações de forma semelhantes com a que criamos na Web, mas ao invés de _Controllers_ criamos _Commands_, por exemplo. Todas as facilidades de um framework moderno podem ser utilizadas fora da Web sem maiores problemas.

Obviamente está não é a única opção, mas diversas outras ferramentas fazem uso do _Symfony Console_. Algumas alternativas são _Laravel Zero_, CLImate, Aura.CLI, etc.

#### Performance

Tarefas que são executadas por trás das cortinas tendem a ser mais pesadas, exigir mais I/O ou mais processamento. Nesses casos podemos recorrer a ferramentas específicas para resolver tais problemas.

Se temos um cenários de muitas requisições para servidores externos, seja em chamadas HTTP, STMP ou outros protocolos, devemos fazer bom uso dos streams do PHP e trabalhar com programação assíncrona. Uma ótima ferramenta que pode nos ajudar muito com isso é a [ReactPHP](https://reactphp.org/#core-components) que fornece diversos componentes com os mais diversos propósitos.

Já se muito processamento é utilizado, com calculos complexos, manipulação de imagens e qualquer outra coisa que consuma muita CPU, paralelização é a resposta. Podemos criar processos através da extensão [pcntl](https://php.net/pcntl) ou threads através da extensão [parallel](https://php.net/parallel). Ambas as opções requerem um estudo mais aprofundado sobre conceitos de sistemas operacionais e programação paralela, mas o resultado é muito gratificante.

Se você quiser entender um pouco melhor sobre a diferença entre Programação Assíncrona e Programação Paralela, pode conferir este vídeo:

<lite-youtube videoid="zLfXPSeCkB8">
    <a href="https://youtube.com/watch?v=zLfXPSeCkB8" class="lty-playbtn" title="Reproduzir vídeo">
        <span class="lyt-visually-hidden">
            Programação assíncrona vs Programação paralela - Entenda a diferença | Programando com Vinicius Dias
        </span>
    </a>
</lite-youtube>

## Conclusão

Nesta rápida leitura já conseguimos notar que não só é possível utilizar PHP fora da Web como também ele está muito preparado para este ambiente.

Por ser uma linguagem de programação completa e madura, diversas bibliotecas, extensões e componentes já surgiram para resolver problemas comuns e cabe a nós, devs e amantes do PHP, aprendê-las e utilizá-las.

Além disso, com o advento do [JIT](https://youtube.com/watch?v=WLx0z9kloro) que chegará no PHP 8, o uso do PHP fora da web se tornará ainda mais efetivo. Diversas otimizações de baixo nível que eu nem mesmo sei explicar vão acontecer, tornando possíveis aplicações que requerem ainda mais processamento como IoT, Machine Learning e vários outros nomes bonitos que não me arriscarei a citar.

Se você ainda acha que PHP está preso na Web, acredito que não há momento melhor para abrir os olhos e conhecer este novo mundo!

