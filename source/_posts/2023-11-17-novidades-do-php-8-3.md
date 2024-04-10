---
title: "Novidades do PHP 8.3: O que há de novo nessa versão do PHP"
date: "2023-11-17"
description: "Explore as novidades do PHP 8.3, incluindo novas funções, novas classes, descontinuações e muito mais. Fique por dentro das melhorias e assista aos vídeos explicativos no canal Dias de Dev."
tags: ["PHP 8.3", "readonly", "constantes tipadas", "FFI", "PHP Override", "exceções de DateTime", "json_validate", "novidades PHP", "programação PHP", "desenvolvimento web", "Dias de Dev", "PHP 8.3 features", "atualizações PHP", "linguagem de programação", "deep copy em PHP", "segurança de tipos", "métodos magicos em PHP"]
categories: ["PHP"]
video: true
---

A versão final do PHP 8.3 está agendada para ser lançada no dia [23 de novembro de 2023](https://wiki.php.net/todo/php83) e traz algumas novidades bem interessantes, contando com novas funções, novas classes e código que passa a ser considerado obsoleto.

## Modificações sobre `readonly`

Uma _RFC_ intitulada _Readonly amendments_ propõe duas mudanças em como a palavra-chave `readonly` se comporta, porém apenas uma dessas mudanças foi aceita. A partir da versão 8.3 do PHP, é possível reinicializar propriedades `readonly` ao clonar objetos, ou seja, dentro do [método mágico](/2023-08-11-metodos-magicos-php) `__clone`.

Isso torna o seguinte código, que no PHP 8.2 causaria um erro, possível:

```php
<?php

readonly class Usuario
{
    public function __construct(
        public \DateTimeImmutable $nascimento, 
    ) {}
    
    public function __clone() : void
    {
        $this->nascimento = clone $this->nascimento;
    }
}
```

Essa funcionalidade, embora pareça pequena, permite que realizemos _deep copy_ de objetos que possuam propriedades `readonly`.

Se quiser ver mais sobre essa nova funcionalidade, eu tenho um vídeo sobre ela em meu canal do YouTube:

<lite-youtube videoid="yE2Ei9xsJnk">
    <a href="https://youtube.com/watch?v=yE2Ei9xsJnk" class="lite-youtube-fallback" title="Reproduzir vídeo">
        Novidades do PHP 8.3: Modificações sobre readonly | Dias de Dev
    </a>
</lite-youtube>

## Constantes tipadas em classes

A partir do PHP 8.3 é possível definirmos os tipos de constantes em nossas classes. Essa possibilidade nos traz mais segurança de tipos principalmente quando há herança entre classes ou implementação de interfaces que possuem constantes. Até o PHP 8.2, uma classe poderia sobrescrever uma constante herdada adicionando qualquer valor, sem checagem de tipo. Isso poderia trazer problemas como o seguinte:

```php
interface InterfaceTeste {
    const TEST = "Test";
}
 
class ClasseBase implements InterfaceTeste {
    const TEST = []; // Mudamos o tipo aqui
}
 
class ClasseDerivada extends ClasseBase {
    const TEST = null; // Mais uma vez, outro tipo
}
```

Ao acessar a constante `TEST` de algum objeto do tipo `InterfaceTeste`, não havia nenhuma garantia que seu tipo sempre seria `string`. Com o PHP 8.3, o seguinte é possível:

```php
interface InterfaceTeste {
    const string TEST = "Test";
}

class ClasseBase implements InterfaceTeste {
    const array TEST = []; // Isso falharia, pois muda o tipo da constante
}
```

## Retorno nulo em FFI

Ao chamar uma função que não retorna nada, ou seja, `void`, via `FFI`, o PHP retornava um tipo específico chamado `FFI\CData` com o valor `void`. Agora, assim como em uma função PHP com o retorno `void`, nós receberemos `null` dessa função. Exemplo:

```php
$ffi = FFI::cdef(
    "void free(void *ptr);",
    "libc.so.6"
);
// Até o PHP 8.2, isso retornaria `FFI\CData`, agora retorna `null`
$ffi->free(/* ponteiro*/);
```

## Atributo `#[\Override]` para sobrescrita de métodos

Um novo atributo chega ao PHP 8.3. O atributo `#[Override]` permite que o código deixe claro que o método anotado com ele está sobrescrevendo um método da classe base, ou seja, caso haja alguma inconsistência na herança (como nome do método escrito errado) um erro de compilação será exibido.

Isso permite encontrar erros como o seguinte:

```php
<?php
class Conta
{
    public function saca(int $valor): void { /* implementação */ }
}

class ContaCorrente
{
    public function sacar(int $valor): void { /* implementação modificada */ }
}
```

O código acima possui um erro sutil no nome do método. Ao chamar `(new ContaCorrente())->saca($valor)`, embora a intenção seja chamar o método da classe `ContaCorrente` que sobrescreve o método da classe `Conta`, nós na verdade estamos chamando o método da classe `Conta` mesmo. Esse novo atributo nos permite descobrir esse erro com mais facilidade, exibindo uma mensagem de erro bastante clara:

```php
<?php
class Conta
{
    public function saca(int $valor): void { /* implementação */ }
}

class ContaCorrente
{
    #[Override]
    public function sacar(int $valor): void { /* implementação modificada */ }
}
```

Isso geraria o seguinte erro:

> Fatal error: ContaCorrente::sacar() has #[\Override] attribute, but no matching parent method exists

Essa é mais uma novidade do PHP 8.3 sobre a qual eu gravei um vídeo específico em meu canal do YouTube. Aqui você pode conferí-lo:

<lite-youtube videoid="OO2fMqTAwZE">
    <a href="https://youtube.com/watch?v=OO2fMqTAwZE" class="lty-playbtn" title="Reproduzir vídeo">
        <span class="lyt-visually-hidden">
            Novidades do PHP 8.3 - Novo atributo (Override) para sobrescrita de métodos | Dias de Dev
        </span>
    </a>
</lite-youtube>

## Exceções de DateTime mais adequadas e específicas

Algumas novas classes de exceção são introduzidas no PHP 8.3. Se tratando de `DateTime`, essas são as novas exceções:

- `DateException`
  - `DateInvalidOperationException`
  - `DateInvalidTimezoneException`
  - `DateMalformedIntervalStringException`
  - `DateMalformedPeriodStringException`
  - `DateMalformedStringException`
- `DateError`
  - `DateObjectError`
  - `DateRangeError`

Com isso, algumas exceções lançadas anteriormente ao instanciar objetos do tipo `DateTime`, `DateTimeImmutable`, `DateInterval` e `DatePeriod` podem ser diferentes agora. Um exemplo:

```php
// Até o PHP 8.2, uma exceção do tipo `Exception` seria lançada
// A partir do 8.3, `DateMalformedStringException` será lançada
new DateTime('data inválida');
```

Essa é uma _RFC_ simples, mas com um grande número de modificações. Se quiser saber mais sobre cada caso que pode lançar uma das novas exceções, você pode conferir a [página da _RFC_](https://wiki.php.net/rfc/datetime-exceptions).

## Nova função `json_validate`

Em alguns cenários nós precisamos garantir que uma _string_ é um _json_ válido, mas não necessariamente precisamos realizar a transformação dessa _string_ em um objeto ou _array_ em PHP. Se nós precisamos armazenar no banco de dados um _json_ recebido na requisição, por exemplo, não há necessidade de realizar todo o trabalho de transformar esse _json_ com a função `json_decode`.

Porém, até o PHP 8.2, a única forma de descobrirmos se uma _string_ é um _json_ válido em PHP era através da função `json_decode`. Esse desperdício de recursos foi resolvido no PHP 8.3 com a chegada da função `json_validate`.

Essa nova função garante que o _json_ é válido, mas sem precisar alocar memória para salvar seu conteúdo transformado já que ela simplesmente retorna um booleano.

Eu gravei um vídeo curto no YouTube (no formato de _shorts_) falando sobre essa nova função. Você pode conferir aqui:

<lite-youtube videoid="7rnKavIf67w">
    <a href="https://youtube.com/watch?v=7rnKavIf67w" class="lty-playbtn" title="Reproduzir vídeo">
        <span class="lyt-visually-hidden">
            Novidades do PHP 8.3: Nova função json_validate | Dias de Dev #shorts
        </span>
    </a>
</lite-youtube>


## Comando `php -l` agora suporta múltiplos arquivos

Um comando muito útil é o `php -l` que permite verificar se um arquivo possui algum erro de sintaxe. Até a versão 8.2 do PHP apenas um arquivo podia ser analisado por vez. Agora, a partir do PHP 8.3, nós podemos passar diversos arquivos para o `php -l` analisar. Exemplo:

```shell
php -l arquivo1.php arquivo2.php
```

O comando exibirá, caso nenhum dos arquivos possua erros de sintaxe:
> No syntax errors detected in arquivo1.php
> 
> No syntax errors detected in arquivo2.php
 
## Funções array_sum e array_product mais consistentes

As funções `array_sum` e `array_product` possuiam um comportamento menos previsível quando valores não numéricos eram encontrados nos arrays a serem processados. Essa novidade traz uma maior consistência e previsibilidade para seu comportamento.

Por exemplo:

```php
$input = [true, STDERR, new stdClass(), []];
var_dump(array_sum($input));
var_dump(array_product($input));
```

Tanto até o PHP 8.2 quanto no PHP 8.3, os resultados serão 4 e 3, porém no PHP 8.3 diversos alertas serão exibidos informando que não é possível realizar operações matemáticas em `resource`, em `stdClass` e em `array` (`true` vira 1 em operações matemáticas no PHP e isso não muda nessa versão).

Isso faz com que nós sejamos notificados pela aplicação caso operações matemáticas estejam sendo realizadas onde não deveriam.

Há mais pontos de melhoria trazidos por essa _RFC_ e por isso eu também tenho um vídeo completo sobre ela:

<lite-youtube videoid="cpJAwte1xZU">
    <a href="https://youtube.com/watch?v=cpJAwte1xZU" class="lty-playbtn" title="Reproduzir vídeo">
        <span class="lyt-visually-hidden">
            Novidades do PHP 8.3 - Funções array_sum e array_product mais consistentes | Dias de Dev
        </span>
    </a>
</lite-youtube>

## Mais novidades

Você já deve ter reparado que esse post começou a ficar bem grande, não é mesmo? O PHP 8.3 realmente está trazendo algumas novidades bem interessantes e nesse post eu quis destacar algumas delas.

Mas se você quiser saber sobre **todas** as novidades que o PHP 8.3 traz, pode conferir a [página oficial das _RFCs_](https://wiki.php.net/rfc#php_83) ou conferir a seguinte lista:

- [Descontinuações do PHP 8.3](https://wiki.php.net/rfc/deprecations_php_8_3)
- [Modificações nos operadores de incremento e decremento](https://wiki.php.net/rfc/saner-inc-dec-operators)
- [Possibilidade de usar expressões em variáveis estáticas](https://wiki.php.net/rfc/arbitrary_static_variable_initializers)
- [Aviso quando `unserialize()` encontrar dados remanescentes](https://wiki.php.net/rfc/unserialize_warn_on_trailing_data)
- [Acesso dinâmico a constantes de classes](https://www.youtube.com/watch?v=h3dZlJrpvi0)
- [Melhoria de tratativa de erros da função `unserialize()`](https://wiki.php.net/rfc/improve_unserialize_error_handling)
- [Descontinuações relacionadas às funções de `assert`](https://wiki.php.net/rfc/assert-string-eval-cleanup)
- [Nova função mb_str_pad](https://wiki.php.net/rfc/mb_str_pad)
- [Melhor definição da semântica da função `range()`](https://wiki.php.net/rfc/proper-range-semantics)
- [Adições à extensão de aleatoriedade (`Randomizer`)](https://wiki.php.net/rfc/randomizer_additions)
- [Utilizar exceções por padrão na extensão `SQLite3`](https://wiki.php.net/rfc/sqlite3_exceptions)
- [Descontinuar funções com sobrecarga](https://wiki.php.net/rfc/deprecate_functions_with_overloaded_signatures)

E se você quiser aprender mais sobre PHP e suas funcionalidades, vou deixar aqui um [cupom de desconto para a Alura](https://tidd.ly/4d42Myb), onde eu tenho diversos cursos sobre PHP, dentre outros assuntos.
