---
title: "Paralelizar testes automatizados"
date: "2022-09-16"
description: "Testes automatizados podem tomar bastante tempo de sua pipeline. Neste artigo nós vamos aprender sobre como paralelizar sua suíte de testes"
tags: ["Testes", "Dias de Dev"]
categories: ["Conceitos"]
---
Testes automatizados podem levar um certo tempo para serem executados, principalmente se forem rodados um a um. Executar mais de um teste por vez pode ser uma boa alternativa para agilizar sua _pipeline_.

## Testes automatizados

A criação e execução de testes automatizados traz inúmeras vantagens e isso por si só poderia ser assunto para outro post completo. Mas um ponto que muitas vezes negligenciamos é o tempo que a execução dos testes pode tomar em nossa _pipeline_ de _build_.

Uma das etapas mais importantes em um ambiente de CI/CD, por exemplo, é a execução dos testes. E sabemos que ter um processo demorado aqui pode até inviabilizar a adoção de práticas de integração contínua.

É muito comum que ao executar a nossa suíte de testes, cada cenário seja executado de forma isolada, um por vez. Porém, atualmente é praticamente regra que os nossos computadores possuam CPUs com capacidade de executar mais de um processo por vez, sendo assim, por que não executar mais de um teste por vez?

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## Paralelização de testes

Paralelismo é um assunto bastante complexo, mas a ideia de paralelizar uma suíte de testes é, na verdade, bem simples: executar mais de um caso de teste por vez, em processos separados.

Um ponto que deve ser considerado é a independência dos testes. Cada teste deve ser completamente independente e não pode usar o resultado ou ações de testes anteriores. Uma forma aumentar a segurança de que os seus testes atualmente são independentes é rodá-los fora de ordem. Dessa forma, se algum teste dependia do anterior, por exemplo, ao executá-los em uma ordem aleatória ele passará a falhar.

## Ferramentas

Tendo entendido a ideia de rodar mais de um teste por vez e que para isso os testes precisam ser independentes, como podemos efetivamente atingir o paralelismo nos nossos testes?

Cada ecossistema terá a sua solução. Em PHP, por exemplo, podemos usar o [Paratest](https://github.com/paratestphp/paratest). Não é necessária nenhuma configuração. Se você tem os seus testes rodando com PHPUnit, basta executar o comando `paratest` ao invés de `phpunit`, mais nada. Já em JS, cada framework de testes possui uma abordagem diferente. O Jest já executa os testes de arquivos diferentes de forma paralela por padrão. Em Java, a sua suíte JUnit pode usar uma ferramenta chamada Surefire. MSTest (para C#) na sua versão 2 permite paralelizar testes também. ExUnit (para Elixir) já executa os testes de cada módulo de forma paralela. Testes em Rust também são executados em paralelo por padrão.

## Conclusão

A vantagem de paralelizar testes é bastante clara e a desvantagem é somente a necessidade dos testes serem isolados, o que já deveria ser um padrão independente da forma de execução.

Cada ecossistema e ferramenta resolve esse problema de uma maneira diferente, mas todos eles possuem alguma solução. Vale a pesquisa para saber mais sobre a linguagem com a qual você trabalha.

Se não estiver familiarizado com conceitos de testes, sugiro assistir [esta playlist](https://youtube.com/playlist?list=PL3j2sfzg3FPsPiaDUmDDKNvco49YMdj8f) de testes automatizados. E se quiser se aprofundar em testes e programação em geral, aqui tem um cupom de desconto para você assinar Alura: <https://alura.tv/diasdedev>
