---
title: "PHP.ini: Aprendendo a configurar o comportamento do PHP"
date: "2023-02-24"
description: "O arquivo php.ini é responsável por conter as configurações que afetam o comportamento do PHP. Aprenda sobre o que pode ser configurado no arquivo e onde encontrá-lo."
tags: ["php.ini", "php", "configurações", "arquivo de configuração", "extensões", "desempenho", "segurança", "erros", "pdo_mysql", "opcache"]
categories: ["PHP"]
---

## O que é o php.ini?

O arquivo `php.ini` é o responsável por conter as configurações que afetam o comportamento do PHP onde ele for executado. O PHP lê as configurações deste arquivo sempre que um novo processo é iniciado.

### Todas as configurações em um único arquivo?

Entendido (mesmo que por alto) o que é o `php.ini`, talvez você se pergunte: "mas todas as configurações do PHP vão ficar em um único arquivo? Esse arquivo vai ser gigante!".

Esse questionamento é muito válido e a resposta é: não. Não é necessário manter todas as configurações em um único arquivo. É possível ter em sua instalação do PHP um diretório configurado onde outros arquivos de configuração (no mesmo formato) serão buscados e carregados.

### Onde encontrar o php.ini?

A localização do arquivo `php.ini` (e dos demais arquivos de configuração) pode variar dependendo do sistema operacional e da forma como o PHP foi instalado, mas há um simples comando para te mostrar essa informação: `php --ini`. Executando esse comando você terá uma saída semelhante a seguinte:

    Configuration File (php.ini) Path: /etc/php/8.2/cli
    Loaded Configuration File:         /etc/php/8.2/cli/php.ini
    Scan for additional .ini files in: /etc/php/8.2/cli/conf.d
    Additional .ini files parsed:      /etc/php/8.2/cli/conf.d/10-opcache.ini,
    /etc/php/8.2/cli/conf.d/10-pdo.ini,

Repare que no exemplo acima, o arquivo "principal" é o `php.ini` encontrado na pasta `/etc/php/8.2/cli`. Mas há também a definição (feita no momento da compilação do PHP) para buscar outros arquivos de configuração na pasta `/etc/php/8.2/cli/conf.d`. Lá estão os arquivos `10-opcache.ini` e `10-pdo.ini`.

#### Prioridade de carregamento

Você deve ter notado que os arquivos "extra" de configuração possuem um número como prefixo (`10-opcache.ini` e `10-pdo.ini`). Esse número **não** tem um significado especial para o PHP, mas nos permite ordenar os arquivos por prioridade. O PHP vai carregar os arquivos `.ini` do diretório configurado em ordem alfabetica, sendo assim, números são adicionados para nós podermos definir a prioridade de carregamento de cada arquivo. Quanto maior o número, "mais depois" ele será carregado, fazendo com que suas definições sejam aplicadas por último, sobrescrevendo as anteriores caso hajam configurações duplicadas.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## O que pode ser configurado pelo php.ini

Existem muitas configurações diferentes que podem ser definidas no arquivo `php.ini`. Algumas das configurações mais comuns incluem:

- Configurações de exibição de erros
- Configurações de segurança
- Configurações de desempenho
- Configurações de extensões

### Exemplos

O formato `.ini` é bastante simples e consiste em uma chave (o nome da configuração) e um valor (o valor da configuração) separados pelo sinal de igualdade (`=`). Além disso, é possível adicionar comentários colocando um ponto e vírgula (`;`) em sua frente.

Sendo assim, para termos um arquivo `php.ini` dizendo que todos os erros devem ser exibidos, habilitando a [configuração `secure` do cookie de sessão](/2022-09-27-cookies-e-seguranca/), tendo o [opcache](https://youtu.be/6vEspHqjrkI) habilitado e a [extensão](/2022-02-13-extensoes-php/) `pdo_mysql` também habilitada, nós teríamos o seguinte:

```ini
; comentário. O PHP não vai ler essa linha
error_erporting=E_ALL
display_errors=1
session.cookie_secure=1
extension=pdo_mysql
opcache.enable=1
```

### Configurações possívels

Você não precisa tentar memorizar a lista de configurações possíveis, pois isso está disponível na documentação do PHP. A documentação de cada [extensão](/2022-02-13-extensoes-php/), por exemplo, possui uma seção de configurações que mostra as possíveis configurações com a explicação de cada um de seus valores.

### Mais detalhes do formato ini

Antes de finalizar, você também deve ter notado que em nosso exemplo, duas linhas possuem um ponto (`.`) no nome da configuração e duas linhas não. Geralmente as configurações de [extensões](/2022-02-13-extensoes-php/) são nomeadas no formato _extensao.configuracao_, ou seja, a configuração `enable` da extensão `opcache` se torna `opcache.enable`. Já as configurações que não são de uma extensão do PHP não possuem esse ponto.

Um outro detalhe do formato `ini` são suas _Sections_. Uma seção é identificada por um nome rodeado por colchetes. Então se eu quiser organizar meu arquivo e nomear uma seção nele com todas as configurações relacionadas a [opcache](https://youtu.be/6vEspHqjrkI), eu poderia ter o seguinte:

```ini
[opcache]
opcache.enable=1
opcache.validate_timestamps=0
; demais configurações de opcache
```

Isso não vai ter nenhum significado especial para o PHP, mas nos permite deixar o arquivo mais organizado para nós lermos futuramente.

#### Seções especiais do php.ini

Entendido o conceito de seções do formato `ini`, há duas seções especiais que podemos ter em nosso `php.ini`, chamadas `HOST` e `PATH`. Elas são utilizadas para limitar configurações que serão carregadas em determinados endereços web (`HOST`) ou em determinados caminhos de arquivos (`PATH`).

Para exibir todos os erros apenas em processos que respondem as requisições em `dev.example.com`, por exemplo, eu poderia ter o seguinte:

```ini
[HOST=dev.example.com]
error_reporting=E_ALL
display_errors=1
```

Caso eu queira desabilitar o [opcache](https://youtu.be/6vEspHqjrkI) no projeto executado na pasta `/meu/projeto`, eu posso ter o seguinte:

```ini
[PATH=/meu/projeto]
opcache.enable=0
```

## Função `ini_set`

Além dos arquivos `.ini`, também é possível realizar algumas configurações no código do PHP, que serão válidas apenas durante aquela execução do processo. Para, por exemplo, habilitar a exibição de erros somente durante a execução de um código, podemos fazer o seguinte:
```php
ini_set('display_errors', true);
```

Na documentação de cada configuração é informado se é possível realizá-la através da função `ini_set` ou apenas a partir de arquivos de configuração.

## Conclusão

Conhecer o `php.ini` é de suma importância para qualquer pessoa que vá trabalhar com PHP, seja como _dev_ ou até em time de operações/sysadmin. Cada [extensão](/2022-02-13-extensoes-php/) do PHP vai ter, em sua documentação, a lista de configurações possíveis. Sempre que você for utilizar uma extensão como _PDO_, _cURL_ ou qualquer outra, analise as configurações possíveis para saber se há alguma possível otimização para seu caso.

Durante o artigo eu deixei alguns links, mas aproveito para deixar algumas referências novamente aqui:

- Post aqui no blog sobre Extensões PHP: [https://dias.dev/2022-02-13-extensoes-php/](/2022-02-13-extensoes-php/)
- Vídeo no meu canal sobre _Opcache_: <https://youtu.be/6vEspHqjrkI>
- Documentação sobre as diretivas do `php.ini`: <https://www.php.net/manual/en/ini.php>
- Cupom de desconto na Alura para você se aprofundar em PHP: <https://alura.tv/diasdedev>
