---
title: "Inteligência Artificial com PHP - Executando modelos com TransformersPHP"
date: "2024-09-27"
description: "Descubra como executar modelos de IA pré-treinados utilizando PHP com a biblioteca TransformersPHP. Aprenda a instalar, configurar e aplicar modelos com exemplos práticos."
tags: [
    "PHP",
    "Inteligência Artificial",
    "TransformersPHP",
    "Modelos Pré-Treinados",
    "Machine Learning",
    "Deep Learning",
    "Processamento de Linguagem Natural",
    "Análise de Sentimento",
    "Resumo de Texto",
    "FFI",
    "Dias de Dev"
]
categories: ["Conceitos"]
video: true
---

Inteligência Artificial é uma área de estudos que está extremamente em alta e neste post, vamos explorar como integrar inteligência artificial ao seu projeto PHP usando a biblioteca TransformersPHP, uma ferramenta que facilita a execução de modelos pré-treinados.

## O que é inteligência artificial

A inteligência é o ramo da ciência da computação que desenvolve algoritmos e sistemas para permitir que máquinas aprendam com dados e realizem tarefas que simulam funções cognitivas humanas.

Existem diversas áreas de estudo dentro da inteligência artificial, como _Machine Learning_, _Deep Learning_, Processamento de Linguagem Natural, Visão Computacional, Robótica, entre outras.

Eu já escrevi aqui no blog sobre _machine learning_, mais especificamente sobre [como aplicar um algoritmo de classificação com PHP](/2024-03-23-o-que-e-machine-learning). Lá eu falei um pouco sobre uma técnica chamada de **aprendizado supervisionado**, onde nós fornecemos a um algoritmo um conjunto de dados de entrada e saída esperada, e ele aprende a mapear esses dados para fazer previsões com novos dados.

Agora eu quero falar sobre uma nova área da inteligência artificial, chamada de **transformers**.

## Transformers

Transformers são uma arquitetura de rede neural que pode ser utilizada para diversas tarefas, dentre elas, a tradução de texto, a geração de texto, a classificação de texto, a geração de imagens, entre outras. O famoso ChatGPT, por exemplo, utiliza essa arquitetura para gerar e compreender texto.

Existem diversos modelos pré-treinados que utilizam essa arquitetura e nós podemos utilizá-los de diversas formas diferentes, em diversas linguagens de programação. Nesse texto eu quero te mostrar uma das formas **mais simples** de executar um desses modelos pré-treinados de IA com PHP.

## TransformersPHP

Utilizando [PHP e FFI](/2023-12-18-usando-rust-com-php-e-ffi), nós poderíamos executar modelos pré-treinados de transformers, mas fazer isso manualmente seria uma tarefa muito trabalhosa. Para facilitar nossa vida, há algumas bibliotecas, dentre elas, a TransformersPHP. Essa biblioteca PHP para IA faz uso de outras ferramentas por baixo dos panos e abstrai uma grande parte do trabalho, facilitando o uso desse tipo de arquitetura com PHP.

### Instalando e configurando TransformersPHP

O primeiro passo é efetivamente instalar a biblioteca em algum projeto PHP. Há alguns pré-requisitos para isso, como ter a extensão FFI instalada e habilitada em uma **versão recente do PHP**. Atendidos os pré-requisitos (que podem ser conferidos na [documentação oficial do componente](https://codewithkyrian.github.io/transformers-php/getting-started#prerequisites)), podemos efetivamente instalar o TransformersPHP utilizando o _Composer_:
```shell
composer require codewithkyrian/transformers
```

Ao instalar o componente, todas as bibliotecas compiladas necessárias para o funcionamento do TransformersPHP também já serão baixadas graças a um _plugin_ do _Composer_. Com isso, temos o ambiente pronto para executar modelos de machine learning com PHP.

### Resumindo texto com TransformersPHP

Uma das tarefas possíveis utilizando modelos pré-treinados de transformers é a de resumir texto. Você pode ter essa funcionalidade em seu sistema para resumir grandes conteúdos como documentos, notícias, etc. Vou utilizar um modelo treinado com textos em inglês e vou pegar o primeiro parágrafo da página da Wikipedia falando sobre a história da Disney.

```php

use function Codewithkyrian\Transformers\Pipelines\pipeline;

$resumidor = pipeline('summarization');
$textoGrande = <<<TEXTO
The Walt Disney Company (commonly referred to as simply Disney) is an American multinational mass media and entertainment conglomerate headquartered at the Walt Disney Studios in Burbank, California. Disney was founded on October 16, 1923, by brothers Walt Disney and Roy Oliver Disney as Disney Brothers Cartoon Studio; it also operated under the names Walt Disney Studio and Walt Disney Productions before changing it to its current name in 1986. In 1928, Disney established itself as a leader in the animation industry with the short film Steamboat Willie. The film used synchronized sound to become the first post-produced sound cartoon, and popularized Mickey Mouse, who became Disney's mascot and corporate icon.
TEXTO;

$resumo = $resumidor($textoGrande);
var_dump($resumo);

```

A saída será algo parecido com o seguinte:

```
array(1) {
  [0]=>
  array(1) {
    ["summary_text"]=>
    string(113) "The Walt Disney Company is an American multinational mass media and entertainment conglomerate. It was founded on"
  }
}
```

Repare que o resumo foi cortado. Isso se dá pelo fato de um parâmetro padrão de tamanho máximo ser de 20 tokens. Nós podemos melhorar essa saída informando um número maior de tokens possíveis a serem gerados pelo modelo, permitindo que ele consiga trabalhar com mais liberdade. Para isso, basta informar o parâmetro `maxNewTokens`:

```php
$resumo = $resumidor($textoGrande, maxNewTokens: 100);
```

Com esse novo número, uma possível saída é a seguinte:

```
array(1) {
  [0]=>
  array(1) {
    ["summary_text"]=>
    string(335) "The Walt Disney Company is an American multinational mass media and entertainment conglomerate. It was founded on October 16, 1923, by brothers Walt Disney and Roy Oliver Disney as Disney Brothers Cartoon Studio. It operated under the names Walt Disney Studio and Walt Disney Productions before changing it to its current name in 1986."
  }
}
```

#### Entendendo o código

Com um resultado minimamente satisfatório, vamos entender o que cada parte desse código faz. A função `pipeline` traz o mais alto nível de abstração desse componente, nos fornecendo acesso a tarefas pré-definidas, como o caso de resumo (_summarization_ em inglês). Outras possibilidades seriam análise de sentimento (_sentiment analysis_), tradução (_translation_), etc.

Ao definir uma tarefa, há um modelo pré-treinado padrão já definido pelo componente. O segundo parâmetro da função `pipeline` nos permite alterar esse modelo. No caso de resumo, o modelo padrão é o [Xenova/distilbart-cnn-6-6](https://huggingface.co/Xenova/distilbart-cnn-6-6).

Tendo criado nossa _pipeline_, basta passar o texto que queremos resumir e quaisquer parâmetros adicionais, sendo que cada tarefa pode ter parâmetros diferentes. No caso de resumo, o parâmetro `maxNewTokens` é um dos possíveis e a documentação traz os demais.

### Análise de sentimentos com PHP

Para entrarmos em outro exemplo de como TransformersPHP pode lidar com textos, vamos realizar uma simples [análise de sentimentos com PHP](https://youtu.be/p3V9_qOBMBQ). Nós vamos passar algumas frases para um modelo e descobrir se essas frases são positivas, negativas ou neutras.

```php
use function Codewithkyrian\Transformers\Pipelines\pipeline;

$analisador = pipeline('sentiment-analysis');
$positiva = $analisador('I love PHP!');
// ['label' => 'POSITIVE', 'score' => 0.99986254571945]
$negativa = $analisador('I hate JavaScript!');
// ['label' => 'NEGATIVE', 'score' => 0.99909101763341]

```

O resultado tem duas informações: a chave `label` indica se o sentimento é positivo ou negativo, enquanto `score` indica a confiança do modelo nesse resultado.

### Encontrando modelos

O TransformersPHP permite que nós utilizemos diversos modelos disponíveis no [HuggingFace](https://huggingface.co/), que é uma espécie de repositório para modelos de inteligência artificial para diversas tarefas e com diversas arquiteturas. Alguns modelos exigem um código um pouco mais "configurável" do que simplesmente utilizar a função `pipeline`, mas isso pode ser assunto para outro texto. Caso se interesse, é só deixar aqui nos comentários. 😉

### Outras tarefas possíveis com TransformersPHP

## Conclusão

Machine Learning é uma área de estudos fascinante e pode nos abrir um novo mundo de possibilidades e com ferramentas como TransformersPHP essas possibilidades estão abertas a nós, devs PHP. Se você se interessou pelo assunto, pode gostar do vídeo a seguir onde eu explico novamente o conceito de classificação e o aplico em outro conjunto de dados:

<lite-youtube videoid="HP7gluvSY9U" style="background-image: url('https://i.ytimg.com/vi/HP7gluvSY9U/hqdefault.jpg');">
    <a href="https://youtube.com/watch?v=HP7gluvSY9U" class="lty-playbtn" title="Reproduzir vídeo">
        <span class="lyt-visually-hidden">Reproduzir vídeo: Machine Learning com PHP: Aprendizado de máquina na prática | Dias de Dev</span>
    </a>
</lite-youtube>

Quer aprender mais sobre Machine Learning e PHP? Aproveite [este cupom exclusivo de 15% de desconto na Alura](https://tidd.ly/3zpVV33) e eleve suas habilidades!
