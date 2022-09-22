---
title: Wrapper de Streams php://
date: "2020-11-03"
description: "Streams em PHP são muito poderosos mas pouco difundidos e divulgados. Neste artigo vamos falar do wrapper php://"
tags: ["PHP", "Wrappers", "Arquivos", "Dias de Dev"]
categories: ["PHP"]
---
## Streams

Antes de falarmos sobre um wrapper específico, é legal dar um certo contexto sobre streams.

Um stream basicamente é um fluxo de dados. Usando streams podemos realizar operações de I/O como leitura de arquivos,
acessos a rede, comunicação por sockets e muito mais.

Existem muitas funcionalidades que giram em torno dos streams do PHP como filtros, contextos, etc,
mas neste artigo meu foco vai ser em um wrapper específico.

## Wrappers

Wrappers de streams em PHP são o código que diz como aquele determinado protocolo vai ser usado e gerenciado.

Ler um arquivo é diferente de realizar uma requisição HTTP que é diferente de se conectar com um Unix socket.
Para que todas essas diferenças sejam abstraídas para nós devs, o PHP fornece wrappers.

Quando você abre um arquivo para leitura em PHP, usa o wrapper ``file://``.
Quando faz uma requisição HTTP, usa o wrapper `http://`.
Com wrappers diferentes, podemos utilizar o mesmo código para realizar tarefas completamente diferentes. Ex.:

```php
<?php

echo file_get_contents('file://arquivo.txt'); // lê um arquivo
echo file_get_contents('http://google.com'); // faz uma requisição HTTP
```

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

### Wrappers disponíveis

Por padrão o PHP já fornece diversos wrappers como

- `file://`
- `http://` e `https://`
- `ftp://`
- `zlib://`
- `ssh2://`
- `rar://`
- etc

Existem outros wrappers fornecidos por padrão e além disso nós podemos criar nossos próprios wrappers.
Mas isso foge do escopo desse artigo e no final dele vou deixar alguns links de referências.

## Wrapper php://

Um dos wrappers mais interessantes e que menos vejo material sobre é o `php://`.
Através dele temos acesso a diversos recursos de I/O como a entrada e saída padrão do sistema, streams temporários em
disco e em memória, etc.

Vamos ver de forma resumida algumas das possibilidades deste wrapper

### php://input

Este provavelmente é o stream mais utilizado fornecido por este wrapper. Através dele nós conseguimos acessar diretamente
o corpo de uma requisição. Então se uma requisição `POST` é feita para seu sistema enviando o corpo em JSON, por exemplo,
o seguinte código pode fazer o parse:

```php
<?php

$corpo = file_get_contents('php://input'); // recupera o corpo todo da requisição, como string
$json = json_decode($corpo); // decodifica a string em json

echo $json->algumValor; // acessa um valor já parseado
```

É válido citar que este stream permite apenas a leitura, logo, não podemos escrever nada nele. 

### php://memory e php://temp

Ambos streams são de leitura e escrita, e nos permitem acesso a um espaço que pode ser no disco ou na RAM para manipular
dados temporários. São interessantes para realizar processamentos em dados já existentes usando a interface de streams,
por exemplo.

`php://memory` vai manter todo o dado na RAM enquanto `php://temp` vai utilizar um arquivo quando o conteúdo do stream
atingir um limite de tamanho pré-definido (2MB por padrão).

### php://filter

Aplicar filtros de streams pode trazer grandes poderes para sua aplicação e até poupar bastante uso de memória.
Mas para utilizar filtros, teoricamente nós precisaríamos de um recurso de stream aberto. Qual o problema disso?
Não poderíamos usar filtros com funções como `file_get_contents` que ao invés de um recurso, recebe uma string por
parâmetro.

Usando o stream `php://filter` nós podemos especificar filtros para esse tipo de função sem nenhum problema. Exemplo:

```php
<?php

echo file_get_contents("php://filter/read=string.toupper|string.rot13/resource=http://www.example.com");

```

Isso vai aplicar os filtros `string.toupper` e `string.rot13` ao ler de _http://www.example.com_.

Se você não conhece os filtros de streams, vale a pena conferir as referências no final do artigo. ;-)

### php://stdin, php://stdout e php://stderr

Estes streams fornecem acesso aos streams correspondentes do próprio processo do PHP.
`php://stdin` fornece acesso à entrada padrão do processo (que pode ser o teclado ou um pipe, por exemplo).
`php://stdout` permite acessar a saída padrão, que pode ser o terminal em uma aplicação CLI.
`php://stderr` nos deixa escrever na saída de erro do processo.

O primeiro stream é apenas para leitura, enquanto os 2 outros são apenas para escrita. Não é possível escrever em
`php://stdin` por exemplo.

### php://output

Este stream permite escrever no mecanismo de buffer de saída do PHP, assim como `echo` e `print` fazem.

### php://output vs php://stdout

Você talvez esteja se perguntando a diferença entre `php://output` e `php://stdout`.
Basicamente o primeiro escreve no mecanismo de buffer de saída do PHP, o que permite o controle através de funções
como `ob_start`. Já o segundo escreve direto na saída do processo, não passando pelo controle de buffer do PHP.

Para entender melhor:

```php
<?php

$stdout = fopen('php://stdout', 'w');
$output = fopen('php://output', 'w');

ob_start();

fwrite($output, 'Escrevendo no output' . PHP_EOL);
fwrite($stdout, 'Escrevendo na saída padrão' . PHP_EOL);

ob_end_flush();
```

Ao executar este script em um terminal, o primeiro `fwrite` envia a string para o mecanismo de buffer do PHP, e devido
ao `ob_start()`, não vai ser imprimido ainda. O segundo `fwrite` manda o conteúdo direto para a saída (tela do terminal).
Ao executar `ob_end_flush()` o buffer é enviado para a saída do processo, então o resultado é:
```
Escrevendo na saída padrão
Escrevendo no output
```

### Buffer de saída

Se você não entendeu bem essa parte de buffer de saída e quiser que eu faça um artigo específico sobre isso, é só me
contar nos comentários que eu preparo pra você! :-D

## Conclusão

Analisando apenas um dos possíveis wrappers dá pra ter uma breve noção de como essa feature do PHP é poderosa. Através
de streams podemos compactar e descompactar arquivos, enviar dados por FTP, acessar servidores via SSH e muito mais.

### Referências

Conforme prometido, vou deixar aqui alguns links para que você possa se aprofundar nesse assunto tão rico e importante.

- https://www.youtube.com/watch?v=ZRYMzS97HVQ
    - Nessa palestra o [Alexandre Gaigalas](https://twitter.com/alganet) mostra um pouco do poder dos streams
- https://www.php.net/manual/en/book.stream.php
    - A documentação oficial é sempre um ótimo lugar para recorrer e entender a fundo as funcionalidades
- https://cursos.alura.com.br/course/php-io-arquivos-streams
    - Na Alura existe um curso específico de streams usando filtros, contextos e muito mais. Se quiser 10% de desconto na sua assinatura, confere [esse link aqui](https://www.alura.com.br/promocao/diasdedev).
- [PHP Assíncrono de Forma Nativa](/2020-09-16-php-assincrono-de-forma-nativa/)
    - Aqui mesmo no blog tem um post onde uso streams para realizar programação assíncrona através de I/O não bloqueante.
