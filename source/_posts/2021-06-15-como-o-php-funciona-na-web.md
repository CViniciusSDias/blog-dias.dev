---
title: "Como o PHP funciona na Web?"
date: "2021-06-15"
description: "PHP é uma linguagem famosa pelo seu uso na Web. Mas como o PHP realmente funciona na Web?"
tags: ["PHP", "Web", "Back-end", "Dias de Dev"]
categories: ["PHP", "Web"]
---
O PHP é o que conhecemos como linguagem _server-side_, ou seja, ele roda nos servidores web, e não nos navegadores.

Isso já é de conhecimento geral, mas nem todos entendem como uma requisição sai do navegador e chega em seu código PHP. É exatamente sobre isso que vamos tratar neste artigo.

## Como funciona a Web?

Antes de falarmos sobre o papel do PHP na Web, é muito importante entendermos como a Web funciona. O protocolo HTTP é o que torna toda a comunicação entre nosso navegador e servidores, possível, então é de suma importância que a gente estude ele.

Neste vídeo eu expliquei um pouco de como funciona o processo desde quando damos _Enter_ em nosso navegador até termos uma resposta em nossa tela. Vale a pena conferir antes de continuar lendo este artigo:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/B2IWlnJ_dt0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Existem várias outras referências (inclusive mais completas) para você conhecer as tecnologias por trás da Web. Vou deixar aqui algumas referências:
- [Desconstruindo a Web: As tecnologias por trás de uma requisição](https://amzn.to/3lzFVkD)
- [HTTP: The Definitive Guide](https://amzn.to/35k9rT1)
- [Learning Http/2: A Practical Guide for Beginners](https://amzn.to/3gEgz22)
- [Cursos de HTTP na Alura](https://www.alura.com.br/promocao/diasdedev)

Com esse conhecimento, já podemos partir para o foco deste artigo: como o **PHP** funciona na Web?

## CGI (_Common Gateway Interface_)

A primeira forma de se executar código em servidores ao receber uma requisição HTTP foi através de uma técnica chamada CGI (_Common Gateway Interface_).

Esta técnica consistia em basicamente um servidor Web (como Apache, por exemplo) receber uma requisição HTTP e executar um processo enviando os dados da requisição através da entrada padrão. A saída do processo era lida pelo servidor Web e devolvida em uma resposta HTTP.

Assim o PHP nasceu, sendo uma espécie de _framework_ C. O Apache executava um programa escrito em C, onde PHP era um conjunto de ferramentas para facilitar a escrita, principalmente de _templates_ (para não misturar C e HTML).

Esta é a forma mais rudimentar de se executar um código _server-side_ e não é mais recomendada, pois há alternativas mais interessantes que veremos neste artigo.

## Apache mod_php

Conforme o PHP (e a Web em si) foi evoluindo, a abordagem utilizando CGI foi se mostrando ineficaz, desperdiçando recursos de processamento.

Neste momento surgiu um módulo do PHP para Apache, o famoso `mod_php`. Esse módulo "anexava" um executável do PHP em cada processo do Apache, ou seja, a cada processo que o Apache criava para servir uma requisição, o executável do PHP era também inicializado, mesmo que a requisição fosse apenas para servir arquivos estáticos e o PHP não fosse necessário.

Isso era muito mais rápido do que utilizar CGI, mas ainda havia muito desperdício de recursos. O apache evoluiu a ponto de não precisar criar um processo a cada nova requisição e passou a trabalhar com _threads_, mas além dessa evolução ter demorado para acontecer, esse modelo não funciona bem com o `mod_php`.

## FastCGI e PHP-FPM

Com a nova solução do `mod_php` também se mostrando ineficaz perante a tantas evoluções do PHP e da Web (ambos sempre cresceram juntos), o protocolo FastCGI passou a ser utilizado. Com isso, um servidor Web recebia as requisições e apenas se fosse necessário algum processamento, executaria o PHP.

Porém, essa execução não era como no CGI. Um conceito de "processos persistentes" foi utilizado, diminuindo muito a quantidade de recursos necessários para processar cada requisição. Um único processo agora passa a ser capaz de tratar diversas requisições e não apenas uma. Com isso todo o _overhead_ de criar e matar processos a cada requisição foi drasticamente reduzido.

Para extrair o máximo do protocolo FastCGI, foi desenvolvida uma ferramenta chamada PHP-FPM (_FastCGI Process Manager_). Este servidor de aplicação permite que realizemos diversas configurações como o número de processos _workers_, a quantidade de recursos liberada para cada processo e muito mais. Este é o software utilizado atualmente para termos um servidor FastCGI em produção com PHP.

Atualmente, qualquer servidor web que saiba se comunicar através do protocolo FastCGI pode ser utilizado em conjunto com PHP, mas o _Nginx_ ganhou muita força por prometer (e segundo benchmarks, cumprir) entregar diversas melhorias de performance em relação ao Apache. Os recursos são mais bem gerenciados e o uso de programação assíncrona através de _multiplexing_ de I/O trazem ganhos expressivos quando comparamos com o ainda amplamente utilizado Apache.

## Arquitetura _share-nothing_

Em qualquer uma das abordagens citadas até agora, uma das principais filosofias do PHP se mantém: a _share-nothing architecture_.

A ideia por trás disso é não compartilhar nenhum recurso entre uma requisição e outra. Por mais que o mesmo processo possa ser utilizado para servir múltiplas requisições, em nosso código, cada execução é como um novo processo. Ao finalizar a execução de um código PHP, todas as variáveis são excluídas, todos os recursos são liberados. Praticamente nada é armazenado entre uma requisição e outra.

Isso permitiu e ainda permite que o PHP tenha uma arquitetura muito simples de escalar e isso é um dos fatores que contribuíram para a ampla adoção do PHP como linguagem back-end Web.

A abordagem utilizando Nginx + PHP-FPM é a ideal para grande parte das aplicações que usam PHP, porém existem cenários onde ainda mais performance é necessária.

## Servidores auto-contidos

Quando temos milhões de requisições chegando ou comunicação em tempo real acontecendo, o fato de ser necessária a inicialização de todas as variáveis novamente e o início do código de toda nossa aplicação ter que ser realizada a cada requisição pode ser um peso. Imagine que a cada requisição seu _framework_ favorito (que provavelmente é bem pesado) precisa ser inicializado novamente.

Para resolver os problemas deste tipo de aplicação que demanda um nível a mais de performance, servidores auto-contidos podem ser utilizados. Um servidor auto-contido é um serivdor web exposto pela própria aplicação, ou seja, seu próprio código PHP recebe diretamente as requisições.

Com isso a inicialização da sua aplicação pode ser feita uma única vez e a cada nova requisição, podemos somente executar o código necessário, sem necessidade de levantar de novo o _framework_, buscar as configurações, ler variáveis de ambiente, processar as dependências, definir as rotas, etc.

Essa abordagem já é possível há muito tempo. Um dos precursores desta técnica é o [PHP-PM](https://github.com/php-pm/php-pm) que usa o [ReactPHP](https://reactphp.org/) por baixo dos panos. O ReactPHP facilita a execução de código assíncrono e não bloqueante no PHP através de um _Event Loop_. Nós falamos um pouco sobre programação assíncrona [neste post](/2020-09-16-php-assincrono-de-forma-nativa/). O ReactPHP torna esta tarefa MUITO mais fácil, por isso ferramentas como PHP-PM puderam surgir.

Outros _frameworks_ como [Amp PHP](https://amphp.org/) têm a mesma proposta, porém uma ferramenta um pouco diferente tem chamado muita atenção nos últimos anos e levado essa proposta para outro nível

## Swoole

É impossível falar de servidores auto-contidos PHP e não citar o [Swoole](https://www.swoole.co.uk/).

A principal diferença entre o Swoole e as demais ferramentas citadas de servidores auto-contidos é que o Swoole não é um componente em PHP e sim uma extensão, ou seja, o Swoole foi escrito em C e compilado para ser "integrado" ao PHP. Isso além de conceder ainda mais performance para o código, ainda dá poderes a mais para o Swoole como lidar de forma assíncrona com código que originalmente seria síncrono (como com PDO e curl, por exemplo).

Já existe material por aí sobre Swoole, inclusive [esse vídeo](https://youtu.be/GCECSLtT49U) no meu canal e o [livro](https://amzn.to/3gxamov) escrito por um dos criadores da ferramenta, por isso não vou transformar esse artigo em um tutorial, mas vale a pena pesquisar mais a fundo.

## Conclusão

Vimos neste artigo que há várias formas para fazer com que uma requisição chegue no PHP. Algumas bem antigas, outras bem modernas.

Atualmente as 2 opções aceitáveis são utilizando PHP-FPM ou algum servidor auto-contido. Nenhuma das 2 abordagens tira o papel de servidores Web como o amado Apache ou o moderno Nginx.

No caso do PHP-FPM precisamos de um servidor para receber as requisições HTTP e enviar as chamadas para o PHP com FastCGI. No caso de um servidor auto-contido, podemos ter um proxy reverso servindo os arquivos estáticos e realizando cache, por exemplo, enquanto o servidor auto-contido responde apenas as requisições realmente necessárias.

Se você quiser aprender mais sobre algum desses assuntos, pode considerar assinar a Alura. Lá existem treinamentos (gravados por mim) sobre Nginx, ReactPHP, Swoole e muito mais. Caso pretenda estudar na Alura, [neste link](https://www.alura.com.br/promocao/diasdedev) você tem um desconto de 10%.
