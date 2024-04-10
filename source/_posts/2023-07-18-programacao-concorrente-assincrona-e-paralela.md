---
title: "Programação assíncrona, concorrente e paralela"
date: "2023-07-18"
description: "Os temos programação assíncrona, programação concorrente e programação paralela trazem muitas confusões. Entenda nesse texto o que os termos significam na prática e quando cada um dos conceitos é necessário."
tags: ["Assíncrono", "Paralelo", "I/O Não bloqueante", "Dias de Dev"]
categories: ["Conceitos"]
video: true
---

Existem diversas definições para os termos programação assíncrona e programação concorrente, enquanto programação paralela seja um consenso. Vamos tentar, neste texto, definir de forma mais objetiva e prática o que esses termos significam e quando nós devemos usar cada uma dessas práticas.

## Programação assíncrona

O termo programação assíncrona pode se referir a mais de uma coisa na computação e permeia o mundo da programação há muito tempo, mas houve um aumento no uso dessas palavras desde a vinda das _Promises_ para o _JavaScript_.

### Rede e comunicação

Quando programação assíncrona é citada no assunto sobre comunicação em rede, isso significa que as partes envolvidas na troca de mensagens lidarão com essas mensagens quando for possível e não necessariamente imediatamente.

Essa definição parece bastante vaga e nada clara, não é mesmo? Então vamos tentar usar um exemplo prático, usando uma linguagem bastante comum na _Web_ (embora esse conceito seja válido para qualquer ecossistema). Quando você usa a função `fetch` do _JavaScript_, a requisição _HTTP_ será feita, mas a resposta, quando disponível, não vai ser tratada imediatamente. O motor de execução do _JavaScript_ vai executar o código que lida com essa resposta o mais rápido possível, mas não será de forma síncrona ou imediata.

O que isso quer dizer? Ao receber a resposta, o motor de execução do _JavaScript_ vai colocar a função que lida com essa resposta em uma fila e, assim que possível, essa função será executada. Enquanto a resposta não está disponível, ou até mesmo após a resposta chegar, mas antes da função que lida com ela ter sua vez de ser rodada, outros pedaços de código podem ser executados.

No exemplo a seguir, usamos _Promises_ para informar qual é a função que será adicionada na fila quando a resposta estiver pronta, e até lá, outras linhas de código vão sendo executadas.

```js
fetch('https://example.com')
  .then(res => {
    // Essa função pode lidar com a resposta
  });

// Aqui, outros códigos podem ser executados
// antes mesmo da função que lida com a resposta
console.log("Outras funções");
```

Essa "fila de funções" e delegação de execução para um momento futuro é possível graças a um padrão chamado _Event Loop_. O uso de um _Event Loop_ permite que você alcance a programação assíncrona, ou usando um termo menos confuso, **I/O não bloqueante**.

O termo I/O não bloqueante é muito importante porque é o que realmente queremos dizer quando nos referimos a programação assíncrona no contexto de comunicação em rede. Nós estamos realizando alguma operação de I/O (seja comunicação em rede, como no exemplo, ou outras coisas como leitura de arquivos, etc) de forma que o processador não precise ficar esperando pela resposta dessa operação.

Há outro [texto aqui no blog](/2020-09-16-php-assincrono-de-forma-nativa/) explicando como I/O não bloqueante pode ser implementado "na unha" com PHP. Ferramentas como _ReactPHP_ ou _Swoole_ trazem implementações de _Event Loops_ para o mundo PHP, mas bibliotecas mais "simples" como cURL já possuem I/O não bloqueante, permitindo a famosa programação assíncrona.

### Arquitetura de sistemas

Outro tema que pode receber menções do termo programação assíncrona é o de **Arquitetura de sistemas**, ou _System Design_.

Aqui eu vou partir direto para um exemplo para tentar explicar a ideia. Em uma aplicação _Web_, podemos ter tarefas demoradas como geração de relatórios, envios de e-mails, etc. Essas tarefas, se feitas durante uma requisição, podem fazer com que o tempo de resposta seja bem alto, prendendo o cliente _HTTP_ por mais tempo do que necessário.

Uma solução para esse caso é salvar as tarefas que você quer executar em uma fila de mensagens, e ter outro processo executando em plano de fundo essas tarefas, de forma que a resposta _HTTP_ possa ser entregue rapidamente ao usuário e as tarefas demoradas serão feitas no futuro, logo, de forma assíncrona.

O motivo de eu fazer essa explicação de forma mais simples e resumida é que eu já gravei um vídeo explicando a ideia de processamento assíncrono e **mensageria**. Você pode conferir a ideia de programação assíncrona nesse contexto no vídeo abaixo.

<lite-youtube videoid="Rx80QRZRgHc">
    <a href="https://youtube.com/watch?v=Rx80QRZRgHc" class="lty-playbtn" title="Reproduzir vídeo">
        <span class="lyt-visually-hidden">
            Processamento assíncrono com mensageria - Escalando aplicações Web | Dias de Dev
        </span>
    </a>
</lite-youtube>

## Programação paralela

Agora vamos à explicação do termo onde há um maior consenso: programação paralela.

Como o próprio nome deixa claro, programação paralela é o que permite a execução de mais de um pedaço de código **ao mesmo tempo**, ou seja, de forma paralela. Nos dias atuais, a ênfase precisa ser nas palavras **ao mesmo tempo** pois é possível ter uma função sendo executada em cada núcleo da CPU, por exemplo, ou até mesmo em CPUs diferentes.

### Multithreading

Uma das principais formas de atingir a programação paralela é criando _Threads_ (não, não é o clone do Twitter que a Meta criou hahaha). Uma _thread_ é uma linha de execução de um programa, que pode ser executada em um núcleo da sua CPU (seu processador). Sendo assim, se eu crio múltiplas threads, eu posso executar funções ao mesmo tempo em núcleos diferentes do meu processador.

Cada linguagem pode (ou não) fornecer uma forma de você criar _threads_. Em PHP, por exemplo, você pode usar a [extensão](/2022-02-13-extensoes-php/) parallel para atingir esse objetivo. A seguir há um exemplo de como ter uma _thread_ adicional em seu programa para executar tarefas em paralelo:

```php
<?php

use function \parallel\run;

run(function(){
    echo "Esse código é executado em uma thread separada" . PHP_EOL;
});

echo "Já esse código é executado na thread principal" . PHP_EOL;
```

### Multiprocessing

Outra forma muito comum de atingir a programação paralela é a criação de processos ao invés de _threads_. Um processo é basicamente um programa em execução no seu sistema operacional. Todo processo possui pelo menos uma _thread_. Ao criar um novo processo, como há pelo menos uma _thread_ criada também, se torna possível a execução paralela novamente, porém há algumas diferenças importantes.

Todo processo no sistema operacional possui um endereço de memória separado. Ao criar _threads_, esse endereço de memória é compartilhado (já que as _threads_ fazem parte do mesmo processo), logo, compartilhar dados entre threads é uma tarefa fácil. Agora, ao criar um novo processo, um novo endereço de memória é separado. Compartilhar memória entre processos é uma tarefa mais trabalhosa.

Para criar um novo processo, há uma função em `C` chamada `fork`, que clona o processo atual e continua a execução no processo filho a partir da linha seguinte. Exemplo.:

```c
#include <stdio.h>
#include <unistd.h>

int main()
{
    printf("Até aqui, apenas o processo 'pai' é executado\n");
    fork();

    printf("Essa linha será executada 2 vezes. Uma pelo processo pai e outra pelo processo filho\n");

    return 0;
}
```

## Programação concorrente

Agora que entendemos (mesmo que por alto) os conceitos de programação assíncrona e programação paralela, vamos ao termo mais "difícil" de definir: programação concorrente.

O termo programação concorrente possui "problemas" em sua definição porque há vários autores que usam essas palavras para definir coisas bem diferentes. Uma das definições possíveis, inclusive, é que programação concorrente é o conceito explicado no texto de programação assíncrona na comunicação em rede, ou seja, I/O não bloqueante.

Outros autores definem programação concorrente como qualquer técnica de programação que leva à concorrência entre recursos. Por exemplo, se você possui duas funções paralelas que acessam o mesmo arquivo e por isso ambas não podem ser executadas simultaneamente, as técnicas de programação concorrente (como _mutex_) são o que permitem a execução do programa sem erros.

Há ainda outros autores que usam programação concorrente como sinônimo de programação paralela, já que diferentes _threads_ ou processos estão concorrendo pelo processamento da CPU.

Quem já me acompanha há algum tempo sabe que eu sou uma pessoa prática e pragmática, então para mim é muito simples: sempre que alguém se refere a programação concorrente, se pelo contexto não é óbvio o que ela quer dizer, eu pergunto e peço um exemplo. Dessa forma consigo entender exatamente o que a pessoa quer dizer e posso prosseguir com a conversa.

## Quando usar cada uma?

Então, resumindo, quando o assunto é realmente código, nós temos I/O não bloqueante e programação paralela. Essas duas técnicas permitem, de forma muito diferente, executar código que pode aumentar a performance de nossa aplicação, por exemplo. Então quando devo usar cada uma dessas técnicas?

Acredito que pelo uso do termo I/O não bloqueante, a resposta já tenha ficado clara. Sempre que a operação demorada envolver I/O, sua resposta estará na programação assíncrona. Com isso você consegue executar tarefas enquanto operações como chamadas de rede e leitura de arquivos estão sendo realizadas, mas sem o custo adicional de criar novas _threads_ ou processos.

Já a programação paralela é usada quando você possui tarefas demoradas que demandam computação intensa e muito uso da CPU. Cálculos matemáticos complexos, manipulações de imagem e vídeo são alguns exemplos onde programação paralela se faz necessária.

No mundo _Web_ é muito mais comum você precisar de I/O não bloqueante (ou programação assíncrona), por isso o _JavaScript_ possui _Promises_ nativamente e ferramentas como _ReactPHP_ e _Swoole_ existem no ecossistema PHP para trazerem implementações de _Event Loops_. Já ao realizar o processamento assíncrono usando mensageria, suas tarefas de plano de fundo podem realizar processamentos pesados, onde talvez o uso de programação paralela possa ser vantajoso.

## Referências

Durante o texto eu deixei alguns links que podem ajudar a entender alguns conceitos específicos, mas quero deixar aqui mais duas referências muito importantes. A seguir possui um dos primeiros vídeos que gravei para meu canal, explicando justamente a diferença entre os termos e quando nós devemos usar cada uma dessas técnicas:

<lite-youtube videoid="zLfXPSeCkB8">
    <a href="https://youtube.com/watch?v=zLfXPSeCkB8" class="lty-playbtn" title="Reproduzir vídeo">
        <span class="lyt-visually-hidden">
            Programação assíncrona vs Programação paralela - Entenda a diferença
        </span>
    </a>
</lite-youtube>

Já no link a seguir eu deixo um [cupom de 10% de desconto](https://tidd.ly/4d42Myb) para você assinar a Alura, plataforma onde há cursos completos (alguns comigo, inclusive) sobre programação paralela e programação assíncrona (dentre vários outros assuntos de tecnologia).

## Conclusão

Programação paralela é o que permite a execução simultânea de mais de uma porção de código, podendo cada uma estar em um núcleo da CPU, por exemplo. Essa técnica é muito útil quando temos tarefas intensas em processamento como cálculos complexos e manipulação de imagens. Já a programação assíncrona é extremamente importante ao lidar com entrada e saída (I/O), já que permite que executemos tarefas sem bloquear a CPU esperando por respostas de I/O. Programação concorrente é um termo que pode ser definido de diversas formas, onde cada autor descreve essa ideia de forma diferente, indo desde um sinônimo para programação assíncrona até técnicas de compartilhamento de recursos em programação paralela.
