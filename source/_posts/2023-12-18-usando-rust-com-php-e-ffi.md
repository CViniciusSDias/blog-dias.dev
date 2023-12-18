---
title: "Executando Funções Rust em PHP com FFI: Um Guia Passo a Passo"
date: "2023-12-18"
description: "Descubra como usar a FFI (Foreign Function Interface) do PHP para integrar e executar funções escritas em Rust. Aprenda a criar uma biblioteca em Rust, compilá-la e usá-la em conjunto com o PHP, abrindo novas possibilidades de desempenho e eficiência para suas aplicações."
tags: [
    "PHP FFI",
    "Rust",
    "Execução de Código Externo",
    "Biblioteca em Rust",
    "Integração PHP Rust",
    "Desempenho PHP",
    "Tutorial FFI",
    "Programação em Rust",
    "Desenvolvimento Web",
    "Eficiência de Código"
]
categories: ["PHP"]
# video: true
---

Usando FFI (_Foreign Function Interface_) é possível executar código de outras linguagens em PHP. Neste artigo, vamos ver como executar funções escritas em Rust a partir do PHP usando FFI.

## FFI

FFI não é uma particularidade do PHP, mas sim uma técnica que permite que uma linguagem de programação execute código de outra linguagem. Desde sua versão 7.4, o PHP possui uma [extensão](/2022-02-13-extensoes-php) chamada FFI que permite o uso dessa técnica.

Para usar FFI, precisamos ter um arquivo compilado em formato de biblioteca. Normalmente são arquivos `.so` no Linux e `.dll` no Windows. Esses arquivos podem ser gerados a partir de código escrito em C, C++ ou Rust, por exemplo.

## Gerando uma biblioteca em Rust

Entendido o conceito de FFI e sabendo que é possível executar essa técnica com PHP, vamos criar uma biblioteca em Rust. Esse texto não tem a intenção de ser um tutorial de Rust, então vou assumir que você já possua o Rust e Cargo instalados corretamente em seu computador.

Para criar um novo projeto em Rust, execute o comando abaixo em uma pasta da sua escolha:

```bash
cargo new --lib nossa-biblioteca
```

Com isso, alguns arquivos serão criados. Você terá o arquivo de configuração do projeto chamado `Cargo.toml` e o arquivo `lib.rs` que é o arquivo principal da biblioteca.

No arquivo `Cargo.toml`, vamos adicionar a seguinte configuração:

```toml
[lib]
crate-type = ["cdylib"]
```

Com isso, nós informamos ao Cargo que ao compilar nosso projeto, ele deve gerar uma biblioteca que pode ser utilizada por outras linguagens e não apenas por outros projetos Rust.

Se você executar o comando `cargo build`, o projeto recém-criado deve ser compilado sem nenhum problema.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## Escrevendo o código em Rust

Para que a função que nós vamos escrever possa ser executada por outras linguagens, precisamos adotar algumas práticas e é isso que veremos agora.

Nossa intenção é criar uma função que receba dois números e retorne a soma deles. No momento da escrita desse artigo, o código de `src/lib.rs` já possui uma função que faz isso, mas vamos alterá-la para que ela possa ser usada por outras linguagens. Esse é o código inicial ao criar a biblioteca:

```rust
pub fn add(left: usize, right: usize) -> usize {
    left + right
}
```

Vamos começar com os tipos. `usize` significa _unsigned size_ e é um tipo que representa um número inteiro positivo. Nós queremos permitir o uso de números negativos também, então vamos alterar esse tipo. Para manter as coisas simples, vamos usar `i32` que é um inteiro de 32 bits. Isso é equivalente ao `int` de C em um sistema de 64 bits. Com essa alteração, nosso código fica assim:

```rust
pub fn add(left: i32, right: i32) -> i32 {
    left + right
}
```

## Tornando o código acessível por outras linguagens

Até agora escrevemos um código perfeitamente funcional em Rust, mas ele ainda não pode ser executado por outras linguagens que consigam executar bibliotecas. Ainda faltam algumas etapas.

A primeira é justamente informar que essa função chamada `add` pode ser chamada externamente. Isso é feito com a diretiva `extern "C"` do Rust. Ao adicionar `extern "C"` antes de `fn` nós informamos que a função a seguir será visível para outras linguagens.

Mas ainda falta um último detalhe. Ao compilar um código, todo compilador, independente da linguagem, realiza um processo chamado _Mangling_. Esse processo consiste em renomear a função para adicionar informações ou às vezes até para manipular o tamanho do binário resultante da compilação. O problema é que cada compilador faz isso de uma forma diferente e isso impede que uma função escrita em uma linguagem seja chamada por outra linguagem.

O Rust possui um atributo que, quando adicionado a uma função, informa ao compilador que esse processo não deve ser realizado. Dessa forma, nossa função chamada `add` continuará se chamando `add` mesmo após a compilacão. O nome do atributo é `#[no_mangle]` e ele deve ser adicionado antes da função. Com isso, nosso código fica assim:

```rust
#[no_mangle]
pub extern "C" fn add(left: i32, right: i32) -> i32 {
    left + right
}
```

Com isso, nosso código em Rust está pronto para ser executado por outras linguagens.

## Compilando a biblioteca

Para compilar a biblioteca, basta executar o comando `cargo build` na pasta do projeto. O arquivo resultante da compilação estará em `target/debug/libnossa_biblioteca.so` no Linux ou `target/debug/nossa_biblioteca.dll` no Windows.

O arquivo resultante da compilação é uma biblioteca que pode ser usada por outras linguagens.

## Usando a biblioteca em PHP

Agora que temos um arquivo `.so` ou `.dll` gerado, podemos usá-lo em PHP. Para isso, vamos usar a extensão FFI.

Essa extensão possui algumas formas de ser utilizada e o propósito desse texto não é ser um tutorial sobre FFI também. Então vou seguir com a abordagem mais simples, que é informar dois parâmetros à função `FFI::cdef`: o primeiro é uma string contendo as assinaturas das funções que queremos usar e o segundo é o caminho para a biblioteca que queremos usar.

Vamos criar um arquivo `ffi.php` na mesma pasta desse nosso projeto em Rust para realizar o teste. Nosso código para utilizar a função `add` do arquivo `target/debug/libnossa_biblioteca.so` (troque por `.dll` no Windows) fica assim:

```php
$ffi = FFI::cdef(
    'int add(int left, int right);',
    __DIR__ . '/target/debug/libnossa_biblioteca.so'
);

var_dump($ffi->add(1, 2));
```

Caso você tenha a extensão FFI instalada e habilitada, o resultado será `int(3)`. Isso significa que a função `add` foi executada corretamente e retornou o valor `3`.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## Considerações sobre tipos

Repare que em Rust nós escrevemos `i32` como o tipo dos parâmetros e do retorno, enquanto no PHP nós usamos `int`. A extensão FFI espera como definição das funções uma assinatura compatível com C e o tipo `i32`, como foi citado anteriormente, é equivalente ao `int` de C. Por isso, podemos usar `int` no PHP sem problemas. Além disso, diversas conversões são feitas automaticamente pela extensão FFI, por isso o tipo `int` de C virou sem nenhum problema um `int` do PHP, embora por baixo dos panos eles sejam tipos bem diferentes.

### Strings

Tipos numéricos e booleanos são relativamente fáceis de se lidar, mas e quanto a strings? Como podemos passar uma string para o Rust e/ou receber uma string de volta?

O Rust possui um módulo chamado `std::ffi` que é exatamente pensado para trazer funcionalidades quando estivermos escrevendo código que pode interagir com outras linguagens. Um dos tipos presentes nesse módulo é o chamado `c_char` que é equivalente ao `char` de C. Com isso, uma string que em C é um ponteiro para um `char` pode ser representada em Rust como um ponteiro para um `c_char`. Logo, para receber uma string por parâmetro ou para retornar uma string, bastaria utilizarmos `*const c_char` como tipo.

Exemplo de função que recebe uma string e a retorna sem modificações:

```rust
use std::ffi::c_char;

#[no_mangle]
pub extern "C" fn return_message(message: *const c_char) -> *const c_char {
    message
}
```

Em PHP nós poderíamos chamar essa função da seguinte forma:

```php
$ffi = FFI::cdef(
    'const char *return_message(const char *message);',
    __DIR__ . '/target/debug/libnossa_biblioteca.so'
);
var_dump($ffi->return_message('Hello, world!'));
```

E isso nos mostraria `string(13) "Hello, world!"`.

Porém, para manipularmos essa String em Rust, um ponteiro para `c_char` não seria a melhor forma. Então podemos usar o tipo `std::ffi::CStr` para transformar esse ponteiro em uma string manipulável da seguinte forma:

```rust
let string: &str = unsafe { CStr::from_ptr(message) }.to_str().unwrap();
```

Como estamos lidando com um ponteiro, o bloco `unsafe` é necessário. O método `to_str()` tenta transformar o `CStr` em uma string do Rust, mas isso pode falhar, então ele retorna um `Result`. Como sabemos que a string que estamos recebendo é válida, podemos usar o método `unwrap()` para obter a string sem precisar lidar com o `Result`.

Além de `CStr` há também o tipo `CString`. `CStr` está para `&str` assim como `CString` está para `String` no Rust. Com isso nós já conseguimos lidar normalmente com strings em Rust.

## Conclusão

Já que é possível chamar códigos em Rust (ou outras linguagens como C ou C++) a partir do PHP, algumas tarefas que poderiam ser executadas de forma mais eficiente ou até de forma exclusiva a partir de linguagens compiladas ainda podem viver em projetos PHP.

Dois bons exemplos de caso de uso desse tipo de técnica são: 

1. pacote `php-tkui` que usa FFI para chamar o Tk, uma biblioteca gráfica escrita em C, o que permite [criação de aplicações desktop usando PHP](https://youtube.com/watch?v=5yhJMcCVNSI) 
2. Computação de grandes arquivos JSON ou Markdown, que embora seja perfeitamente possível fazer diretamente me PHP, em alguns cenários pode se tornar mais eficiente usando Rust + FFI.

Se você quiser aprender mais tanto sobre Rust quanto sobre PHP, há cursos gravados por mim lá na Alura. Aqui tem um cupom de 10% de desconto para assinar a plataforma:
<https://alura.tv/diasdedev>
