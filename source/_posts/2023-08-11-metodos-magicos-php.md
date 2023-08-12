---
title: "Explorando Métodos Mágicos no PHP: Conceitos e Exemplos Práticos"
date: "2023-08-11"
description: "Descubra como os métodos mágicos no PHP permitem a execução implícita de ações específicas. Explore exemplos práticos que ilustram seu uso em programação orientada a objetos. Aprenda como aproveitar esse recurso poderoso do PHP."
tags: ["PHP", "métodos mágicos", "programação orientada a objetos", "orientação a objetos", "programação PHP", "desenvolvimento web" "Dias de Dev"]
categories: ["PHP"]
---

Os métodos mágicos no PHP são métodos "especiais" que são invocadas implicitamente quando certas ações ocorrem. Neste post, exploraremos esses métodos, como eles funcionam e como podem ser úteis.

### Métodos mágicos: Uma visão geral

PHP é uma linguagem de programação que suporta, dentre outros, o paradigma de programação orientada a objetos. Sendo assim, podemos definir métodos dentro das nossas classes, ou seja, funções que operam no contexto de um objeto. Métodos mágicos são aqueles que podemos definir em nosso código e que são acionados automaticamente pelo PHP em situações específicas.

Alguns exemplos de quando os métodos mágicos podem ser acionados incluem tentativas de acesso a membros inexistentes ou inacessíveis de uma classe, conversões de objetos e verificações especiais.

## Exemplo prático

Um exemplo claro dos métodos mágicos em ação é o caso do framework Laravel. Considere uma classe de modelo (_Model_) que lida com a persistência de um usuário:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{ }
```

Apesar de não definir nenhuma propriedade explicitamente, podemos atribuir valores a propriedades como se elas existissem:

```php
<?php

use App\Models\User;

$user = new User();
$user->name = 'Vinicius Dias';
$user->email = 'email@example.com';
$user->save();
```

O método `save` é entendido como parte da classe base `Model`, mas e quanto às propriedades? Para cenários como esse, os métodos mágicos foram concebidos.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## Implementação de métodos mágicos

O nome de todo método mágico no PHP começa com dois underscores (`__`). Por exemplo, o método `__set` é invocado quando tentamos atribuir um valor a uma propriedade inexistente ou inacessível. Ele recebe o nome da propriedade e o valor como parâmetros:

```php
<?php

class NossaModel
{
    /**
     * @var array<string, mixed> Array associativo contendo todos os valores que definirmos
     */
    private array $atributos;
    
    /**
     * @param string $name Nome da propriedade inacessível que estamos tentando definir
     * @param mixed $value Valor que estamos tentando atribuir a essa propriedade
     * @return void
     */
    public function __set(string $name, mixed $value): void
    {
        /*
         * Aqui, se fizermos $model->teste = 'Valor', criaremos a chave 'teste'
         * na propriedade $atributos com o valor 'Valor'
         */
        $this->atributos[$name] = $value;
    }
}
```

Repare que o código que escrevemos no método é código PHP como qualquer outro. Ali nós poderíamos realizar qualquer tipo de lógica.

### Como acessar esse valor?

Aprendemos a definir um valor a partir de uma propriedade inexistente, mas se tentarmos ler esse valor, receberemos um erro. O código a seguir, por exemplo, falha:
```php
$teste = new NossaModel();
$teste->nome = 'Vinicius';

/*
 * Na linha a seguir, o retorno será nulo e um _Warning_ será emitido
 * dizendo que a propriedade NossaModel::$nome não existe.
 */
echo $teste->nome;
```

Para escrever em propriedades inexistentes, usamos o `__set`. Já para ler de propriedades inexistentes ou inacessíveis, utilizamos o método `__get`. Então poderíamos ter o seguinte método na classe `NossaModel`:
```php
/**
 * @param string $name Nome da propriedade inexistente que estamos tentando ler
 * @return mixed Aqui devemos retornar o valor que corresponderá a essa propriedade 
 */
public function __get(string $name): mixed
{
    // O valor retornado pelo método __get é utilizado onde tentamos acessar a propriedade 
    return $this->atributos[$name];
}
```

Com isso, o código a seguir funcionaria sem problemas:
```php
$teste = new NossaModel();
// Chamada implícita a $teste->__set('nome', 'Vinicius');
$teste->nome = 'Vinicius';

// Chamada implícita a $teste->__get('nome'), que vai retornar 'Vinicius'
echo $teste->nome;
```

## Mais métodos

Até aqui nós citamos apenas 2 métodos mágicos, mas o PHP fornece diversos outros. Vou deixar a seguir uma lista deles:

### Construtor e destrutor

O método construtor, chamado de `__construct`, é executado quando criamos um novo objeto (utilizando `new`). Normalmente utilizamos o método construtor para receber dependências e inicializar as propriedades.

Já o método destrutor, `__destruct`, é executado quando um objeto sai de escopo ou quando o objeto é passado para a função `unset`. Normalmente ele é utilizado para liberar recursos que tenham sido alocados no construtor, como fechar arquivos, conexões, etc. Com a natureza _stateless_ do PHP, esse método não é tão utilizado.

### Conversões

Em alguns cenários nós podemos querer utilizar nossos objetos como um tipo diferente. Se quisermos usar nosso objeto como uma string, por exemplo, podemos utilizar o método `__toString`. O que nós retornarmos nesse método é utilizado se nosso objeto for convertido para string de forma implícita ou explícita. Objetos de resposta HTTP, por exemplo, geralmente implementam esse método retornando o corpo da resposta.

```php
<?php

class Response
{
    private string $body;
    // Outras propriedades
    
    public function __toString() : string
    {
        return $this->body;
    }
}

$response = new Response();
// Definição dos valores

echo $response; // Isso usa o objeto como string, logo, chama o __toString
```

Há também casos onde queremos utilizar nosso objeto como se ele fosse uma função. Para isso existe o método `__invoke`. Se nós passarmos nosso objeto por parâmetro em algum lugar que espera um `callable`, o método `__invoke` será executado. Exemplo:

```php
<?php

class ControllerDeExemplo
{
    public function __invoke(int $parametro1, string $parametro2): void
    {
        // Execução de exemplo
    }
}

$controller = new ControllerDeExemplo();

$controller(1, 'Teste'); // Isso executará o método __invoke
```

### Chamada de métodos

Assim como nós podemos acessar propriedades inexistentes (ou inacessíveis) com métodos mágicos, o mesmo serve para métodos. Se você tentar chamar um método não existente de um objeto, o método `__call` será executado, recebendo o nome do método que tentou ser executado e todos os seus parâmetros. Já o `__callStatic` funciona da mesma forma, mas caso um método **estático** inexistente seja chamado a partir de uma classe. 

```php
class Exemplo
{
    public function __call(string $name, array $arguments): mixed
    {
        /*
         * $name possui o nome do método inexistente que foi executado,
         * enquanto $arguments possui todos os parâmetros que foram passados para esse método
         */
    }
    
    public static function __callStatic(string $name, array $arguments): mixed
    {
        // Equivalente estático ao __call
    }
}

// Chama implicitamente Exemplo::__callStatic(1, 2):
Exemplo::qualquerCoisa(1, 2);

$objeto = new Exemplo();

// Chama implicitamente $objeto->__call(1, 2):
$objeto->qualquerCoisa(1, 2);
```

### Restante dos métodos

Para que esse post não fique ainda maior, vou deixar a seguir uma lista dos demais métodos mágicos com uma breve descrição, mas caso você queira ver mais exemplos e detalhes, pode conferir a [documentação do PHP](https://www.php.net/manual/en/language.oop5.magic.php).

- `__isset`: Método executado caso passemos alguma propriedade inacessível do nosso objeto para a função `isset` ou `empty`;
- `__unset`: Método executado caso passemos alguma propriedade inacessível do nosso objeto para a função `unset`;
- `__sleep`: Ao chamar a função `serialize` passando nosso objeto, esse método é executado **antes** da serialização. Seu retorno deve ser um array contendo os nomes das propriedades do objeto em questão que serão serializadas. Normalmente é utilizado para remover propriedades que não devem ser serializadas com conexões com o banco, arquivos abertos, etc;
- `__wakeup`: Esse método não recebe parâmetros e é executado **após** um dado ser desserializado e o objeto ser criado. Esse método geralmente reconstrói os recursos como conexões com o banco;
- `__serialize`: Similar ao `__sleep`. Se ambos estiverem definidos, apenas `__serialize` é chamado e `__sleep` é ignorado. A diferença é que o `__serialize` deve retornar um array associativo que será serializado ao invés de retornar os nomes das propriedades do objeto;
- `__unserialize`: Similar ao `__wakeup`. Se ambos estiverem definidos, apenas `__unserialize` é chamado e `__wakeup` é ignorado. `__unserialize` recebe por parâmetro o array que foi serializado e com isso, deve reconstruir o objeto;
- `static __set_state`: Esse método é o mais raro. Ele é utilizado para criar um objeto da classe em questão a partir da função `var_export`;
- `__clone`: Método chamado quando um clone de um objeto é criado. `$this` nesse método vai se referir ao novo objeto criado. Normalmente esse método é definido para evitar _shallow copies_ e realizar os clones de todas as propriedades também;
- `__debugInfo`: O retorno desse método deve conter os dados que serão exibidos pela função `var_dump`. Geralmente é um array associativo;

## Conclusão

O PHP possui um grande número de métodos mágicos. Alguns são bastante fáceis de entender como `__get`, `__set` e `__call`, enquanto outros são mais confusos como as diferenças entre `__sleep` e `__serialize`. Há ainda aqueles bem pouco usados como o `__set_state`.

Lembrar de todos os métodos (e suas assinaturas) e o que cada um deles faz não é necessário, mas é importante saber da existência deles para saber o que pesquisar quando for necessário.

Se quiser aprender mais sobre PHP como um todo e sobre tecnologia em geral, vou deixar aqui um cupom de 10% de desconto na Alura, plataforma onde eu gravei inúmeros cursos: <https://alura.tv/diasdedev>.
