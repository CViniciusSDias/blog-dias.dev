---
title: "Machine Learning com PHP: Aprendendo a Criar Algoritmos de Classificação"
date: "2024-03-23"
description: "Aprenda a aplicar Machine Learning com PHP para criar algoritmos de classificação. Este guia prático explora desde os conceitos básicos até a implementação com a biblioteca RubixML. Ideal para desenvolvedores interessados em explorar o potencial do Machine Learning com PHP."
tags: [
    "Machine Learning",
    "PHP",
    "Aprendizado de Máquina",
    "Algoritmos de Classificação",
    "RubixML",
    "Desenvolvimento Web",
    "Inteligência Artificial",
    "Data Science",
    "Modelos de Machine Learning",
    "Machine Learning com PHP",
    "Dias de Dev",
    "Vinicius Dias"
]
categories: ["Conceitos"]
video: true
---

Machine Learning é uma das áreas de estudo do ramo de Inteligência Artificial (IA) que nos permite criar sistemas que aprendem a partir de dados. Aplicar Machine Learning com PHP é uma tarefa que, embora incomum, é perfeitamente possível. Neste texto eu vou te mostrar como escrever um algoritmo de classificação com PHP.

## O que é um algoritmo de classificação?

Antes de colocarmos a mão na massa, é importante conhecer alguns conceitos. Machine Learning é uma área bastante ampla e repleta de possibilidades. Dentre elas, há os algoritmos de classificação. Basicamente, um algoritmo de classificação visa identificar a qual categoria algo pertence, ou seja, retornar a classe prevista para a amostra analisada. Um exemplo bastante comum de algoritmo de classificação é o filtro de spam de e-mails. Uma mensagem pode ser classificada como indesejada ou não. Então, após treinar um modelo, podemos, com as informações da mensagem, tentar prever em qual das duas categorias ela se encaixa.

A intenção deste texto é mostrar como aplicar um algoritmo de classificação com PHP, então vou parar com os detalhes teóricos por aqui. Caso você se interesse por aprendizado de máquina e queira continuar os estudos, é fortemente recomendado que você entenda melhor a teoria por trás dos pontos citados nesse parágrafo.

## Como fazer Machine Learning com PHP

Há algumas bibliotecas disponíveis para aplicarmos técnicas de aprendizagem de máquina com PHP, mas no momento da escrita deste texto a mais atual e ativamente mantida se chama [RubixML](https://rubixml.com/). Essa biblioteca nos permite realizar diversas tarefas como Deep Learning, Regressão, Clusterização e, claro, Classificação.

Para instalar RubixML em um projeto PHP podemos utilizar o composer:
```shell
$ composer require rubix/ml
```

Esse componente não tem requisitos obrigatórios, mas há algumas recomendações como a [extensão](/2022-02-13-extensoes-php) _Tensor_ para computação otimizada de vetores e matrizes e a _parallel_ para realizar computação [paralela](/2023-07-18-programacao-concorrente-assincrona-e-paralela). Para executar os códigos deste texto, nada disso é necessário.

## O que vamos prever com Machine Learning

Nós vamos treinar um modelo de classificação usando PHP para prever se determinado jogador vai durar mais de 5 anos na liga profissional de basquete estadunidense, a famosa NBA.

Para isso, precisamos de estatísticas de diversos jogadores antes de entrarem na NBA e o resultado deles, ou seja, se jogaram durante pelo menos 5 anos após chegarem na liga. Esses dados podem ser encontrados [neste arquivo](https://github.com/ptyadana/Data-Science-and-Machine-Learning-Projects-Dojo/blob/master/Project%20-%20Predict%20Career%20Longevity%20for%20NBA%20Rookies%20with%20Binary%20Classification%20-%20Logistic%20Regression/data/nba_logreg.csv) que contém informações como o número de partidas jogadas, número de minutos, quantidade de pontos por jogo, número de cestas de 3 pontos feitas, etc. E a última coluna contém a classe onde cada jogador se encontra, onde `1.0` significa que o jogador participou por pelo menos 5 anos da liga e `0.0` quer dizer que ele ficou menos do que 5 anos. 

## Etapas do processo de Machine Learning

Em todo processo de Machine Learning nós passamos por algumas etapas ou passos. Nós precisamos primeiro analisar os dados. Para isso nós podemos usar até o próprio _Excel_ para gerar gráficos de correlação entre cada uma das colunas, entender como cada coluna influencia nas classes, ver itens faltantes, etc. 

Após a análise dos dados, realizamos o pré-processamento deles. Existe toda uma área de estudos, chamada feature engineering, para essa análise e manipulação de dados que serão utilizados por um modelo de machine learning. Nessa etapa nós removemos os registros com informações faltantes ou as preenchemos utilizando técnicas adequadas, removemos itens inúteis para o treinamento do modelo, adaptamos números para estarem na escala correta, etc.

Com os dados corretamente modificados, a próxima etapa é o treinamento de um modelo de machine learning. Há inúmeros algoritmos possíveis para cada tarefa que machine learning nos permite fazer e com classificação isso não é diferente. Alguns possíveis modelos de classificação são _K Nearest Neighbors_, _Classification Tree_, _Naive Bayes_, etc. Nós vamos selecionar um modelo e treiná-lo com **parte** dos dados que analisamos e manipulamos.

O motivo de utilizarmos apenas parte dos dados é porque nós separamos outra parte para testar o modelo treinado. Essa parte separada para teste nos permitirá verificar quão preciso está nosso modelo em classificar o que desejamos, já que conhecemos as classes de cada uma das amostras que vamos tentar prever.

Com o teste feito, a última etapa entra em ação: medição. Nós medimos os resultados de nosso modelo utilizando diversas métricas para podermos voltar à etapa de treino e realizar otimizações, seja alterando os parâmetros do modelo utilizado ou até selecionando outro algoritmo.

### Análise dos dados

Agora vamos à prática. A primeira etapa é recuperar os dados. Como eu comentei anteriormente, parte da análise pode ser feita em ferramentas externas como o _Excel_. Lá você pode gerar gráficos e analisar os valores para obter percepções interessantes.

E para recuperar os dados no código PHP, a tarefa fica até fácil. A biblioteca _RubixML_ nos permite criar um conjunto de dados a partir de arrays ou qualquer outro objeto iterável, e a própria biblioteca nos permite também criar um iterador a partir de um arquivo CSV. Sendo assim, para criarmos um _dataset_ a partir do arquivo baixado anteriormente, basta o seguinte código:

```php
<?php

use Rubix\ML\Datasets\Labeled;
use Rubix\ML\Extractors\CSV;

$arquivoCsv = new CSV(__DIR__ . '/nba_logreg.csv', header: true);
$conjuntoDeDados = Labeled::fromIterator($arquivoCsv);

```

Um conjunto de dados classificado (_labeled dataset_) é o que queremos para treinar um modelo de classificação.

### Pré-processamento do conjunto de dados

Após recuperarmos os dados, precisamos manipulá-los antes de treinar qualquer modelo. Em nosso caso, algumas manipulações simples que podemos fazer:

- Remover o nome, já que não é relevante para a predição;
- Transformar os valores em números no PHP, já que eles serão importados como strings;
- Remover dados com informações faltantes;

Nós poderíamos fazer diversas outras manipulações como balanceamento do conjunto de dados, preenchimento dos itens faltantes, etc. Mas essas técnicas já seriam um pouco mais avançadas, então vamos nos ater ao simples. As 3 manipulações citadas ficariam assim:

```php
<?php

$conjuntoDeDados = Labeled::fromIterator($arquivoCsv)
    // Remove o nome do jogador de cada amostra
    ->apply(new LambdaFunction(function (array &$amostra) {
        unset($amostra[0]);
        $amostra = array_values($amostra);
    }))
    // Transforma strings numéricas em números
    ->apply(new NumericStringConverter())
    // Remove amostras com itens faltantes
    ->filter(function (array $amostra) {
        $itensVazios = array_filter(
            $amostra,
            fn ($item) => !is_numeric($item)
        );

        return empty($itensVazios);
    });
```

Agora temos um conjunto de dados sem amostras com informações faltantes, todas as informações são números e o nome foi removido de cada amostra.

### Seleção e treinamento de um modelo

Com o conjunto de dados manipulado, chegou a hora de treinar um modelo a partir dele. Como citei anteriormente, vamos dividir parte desse conjunto para treinar o modelo e a outra parte será usada para testá-lo. Vamos fazer isso de forma proporcional, onde cada parte do conjunto terá a mesma proporção de jogadores que duraram pelo menos 5 anos e que não duraram. Isso se chama divisão estratificada e é interessante para não ocorrer uma divisão desigual onde treinaríamos nosso modelo somente com jogadores que não atingiram 5 anos na liga ou vice-versa.

```php
<?php

// ...
use Rubix\ML\Classifiers\KDNeighbors;

// 80% dos dados para treinamento e 20% para teste
[$treinamento, $teste] = $conjuntoDeDados->stratifiedSplit(0.8);

$modelo = new KDNeighbors();
$modelo->train($treinamento);

```

A partir deste ponto, nossa variável `$modelo` possui um modelo de classificação treinado e pronto para realizar predições, identificando se um jogador, baseado nas informações passadas, deve durar pelo menos 5 anos na NBA. Com o modelo treinado, poderíamos passar o conjunto de informações de diversos jogadores (um array multidimensional) e o modelo nos devolveria a classificação de cada um deles, ou seja, se cada um deles permaneceria por mais de 5 anos na liga (`1.0`) ou não (`0.0`).

Após treinar o modelo, vamos testá-lo para analisar quão corretas estão as predições:

```php
<?php

// ...

$predicoesDeTeste = $modelo->predict($teste);
```

Como nós temos os dados de teste, incluindo suas classes (também chamadas de labels) e temos as predições, podemos comparar ambos para medir quão corretas são as previsões do nosso modelo. Por exemplo, sabendo que determinado jogador realmente jogou por mais de 5 anos na NBA, nosso modelo teria previsto que ele atingiria essa marca ou teria dito que ele não chegaria lá?

### Medição do resultado

Existe um conceito chamado matriz de confusão (_confusion matrix_) utilizado para gerar diversas métricas para modelos de machine learning. Essa matriz vai nos dizer o seguinte: baseado nas predições e nas classes dos dados de teste, quanto nosso modelo acertou e errou de cada classe?

Para gerar essa matriz, podemos executar o seguinte código:

```php
<?php

use Rubix\ML\CrossValidation\Reports\ConfusionMatrix;

$geradorDeMatriz = new ConfusionMatrix();
$matrizDeConfusao = $geradorDeMatriz->generate(
    $predicoesDeTeste,
    $teste->labels()
);
```

A variável `$matrizDeConfusao` vai ter em seu conteúdo, algo como:

```
array(2) {
  '1.0' => array(2) {
    '1.0' =>
    int(124)
    '0.0' =>
    int(46)
  }
  '0.0' => array(2) {
    '1.0' =>
    int(42)
    '0.0' =>
    int(55)
  }
}
```

Isso seria equivalente à seguinte tabela:

<table aria-label="Tabela de matriz de confusão">
    <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">1.0</th>
          <th scope="col">0.0</th>
        </tr>
    </thead>
    <tbody>
        <tr>
          <th scope="row">1.0</th>
          <td>124</td>
          <td>46</td>
        </tr>
        <tr>
          <th scope="row">0.0</th>
          <td>42</td>
          <td>55</td>
        </tr>
    </tbody>
</table>

Ou seja, dos jogadores que nosso modelo previu que durariam pelo menos 5 anos na NBA, 124 realmente duraram e 46 não. Já dos jogadores que o modelo previu que não durariam mais de 5 anos, 55 realmente não duraram, enquanto 42 duraram. Então o modelo realmente acertou mais do que errou.

### Métricas para otimização

Como foi citado anteriormente, a matriz de confusão é utilizada para calcular métricas. Apenas a matriz de confusão não vai ser suficiente para tomarmos a decisão de se nosso modelo é suficiente para nosso objetivo ou não.

Uma simples métrica que pode ser calculada é a acurácia do modelo. Ela basicamente é a medida da frequência em que nosso modelo acertou. É como perguntar: "de tudo que meu modelo previu, quanto ele acertou?" Nós podemos calcular a acurácia da seguinte forma:

```php
<?php

use Rubix\ML\CrossValidation\Metrics\Accuracy;

$metrica = new Accuracy();
$acuracia = $metrica->score($predicoesDeTeste, $teste->labels());
```

O valor de `$acuracia` vai ser um número entre 0 e 1, indicando o percentual geral de acerto do modelo. Essa métrica raramente é suficiente para decidirmos se o modelo está otimizado o suficiente ou não. Há outras métricas como precisão, F1, recall, etc. Nós podemos ter um artigo inteiro falando sobre as diversas possíveis métricas, então nesse artigo vou parar aqui, na acurácia.

Caso o valor das métricas não seja satisfatório, podemos realizar otimizações ou modificar completamente o modelo utilizado, até que tenhamos o resultado esperado.

## Conclusão

Machine Learning é uma área de estudos fascinante e pode nos abrir um novo mundo de possibilidades. Se você se interessou pelo assunto, pode gostar do vídeo a seguir onde eu explico novamente o conceito de classificação e o aplico em outro conjunto de dados:

<lite-youtube videoid="HP7gluvSY9U" style="background-image: url('https://i.ytimg.com/vi/HP7gluvSY9U/hqdefault.jpg');">
    <a href="https://youtube.com/watch?v=HP7gluvSY9U" class="lty-playbtn" title="Reproduzir vídeo">
        <span class="lyt-visually-hidden">Reproduzir vídeo: Machine Learning com PHP: Aprendizado de máquina na prática | Dias de Dev</span>
    </a>
</lite-youtube>

E para se aprofundar ainda mais no mundo de machine learning, inteligência artificial e também PHP, você pode aproveitar esse cupom de 10% de desconto na Alura:
<https://alura.tv/diasdedev>
