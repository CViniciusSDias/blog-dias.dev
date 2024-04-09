---
title: "Entenda o erro \"Cannot modify header information - headers already sent\" no PHP"
date: "2023-03-07"
description: "Entenda o erro \"Cannot modify header information - headers already sent\" no PHP e como evitá-lo em seu código. Saiba o que é HTTP e como funciona na web, além de funções PHP que podem enviar ou modificar cabeçalhos."
tags: ["PHP", "HTTP", "cabeçalhos", "erro", "resposta", "corpo", "cabeçalhos já enviados", "echo", "header", "session_start", "setcookie"]
categories: ["PHP"]
video: true
---

O famoso erro do PHP com o texto "_Cannot modify header information - headers already sent_" acontece quando tentamos enviar um cabeçalho _HTTP_ após já termos enviado alguma saída no corpo da resposta. Nesse post nós vamos entender o que isso tudo significa e como evitar esse problema em seu código.

## _HTTP_

_HTTP (HyperText Transfer Protocol)_ é o protocolo usado na internet, então sempre que você acessa um site usando seu navegador, por exemplo, _HTTP_ está sendo usado.

_HTTP_ é um protocolo que segue uma arquitetura cliente-servidor, onde há duas partes na comunicação. De forma super simplificada: você, usando seu navegador, é o cliente. O site que você acessa é o servidor.

Esse protocolo define mensagens de requisição (_request_) e resposta (_response_). Quando você acessa um site, seu navegador faz uma requisição para o servidor, que processa esse pedido e devolve uma resposta. Essas mensagens são divididas em duas grandes partes: **cabeçalhos** e **corpo**.

O corpo de uma resposta, por exemplo, é o conteúdo que você vê na tela, enquanto cabeçalhos possuem informações adicionais como [cookies](/2022-09-27-cookies-e-seguranca), informações de redirecionamento, etc.

Esse é um resumo bem conciso do protocolo _HTTP_ e de **como a internet funciona**. Ainda sobre esse assunto, caso você tenha alguma dúvida ou queira entender melhor, eu tenho um vídeo no YouTube. Você pode conferí-lo antes de continuar lendo esse post:

<lite-youtube videoid="B2IWlnJ_dt0" style="background-image: url('https://i.ytimg.com/vi/B2IWlnJ_dt0/hqdefault.jpg');">
  <a href="https://youtube.com/watch?v=B2IWlnJ_dt0" class="lty-playbtn" title="Reproduzir vídeo">
    <span class="lyt-visually-hidden">Play Video: Como funciona a Web? - A internet por baixo dos panos | Dias de Dev
</span>
  </a>
</lite-youtube>

## Como o PHP funciona

Entendido como a _web_ funciona, é hora de entender o que o **PHP** faz na _web_. Aqui no blog há um post sobre [como o PHP funciona na Web](/2021-06-15-como-o-php-funciona-na-web) onde você pode entender como o **PHP** é executado, mas aqui vou resumir o que você precisa saber para entender o problema de "_Cannot modify header information - headers already sent_".

Quando você exibe algo em PHP, seja através de funções como `echo` ou até colocando _HTML_ junto com seu PHP, esse conteúdo é enviado no corpo da resposta _HTTP_ que o PHP gera. Isso tudo é feito de forma transparente para nós desenvolvedores.

Como foi citado no parágrafo anterior, uma resposta _HTTP_ é dividida entre **cabeçalhos** e **corpo**, sendo que os cabeçalhos vêm antes do corpo. Sendo assim, para nós adicionarmos algo ao corpo da resposta com PHP, os cabeçalhos precisam ser montados e enviados antes.

Então quando você, em um sistema _Web_ feito em PHP, executa um `echo`, por exemplo, os cabeçalhos da resposta _HTTP_ são montados e enviados e depois o corpo é enviado com o conteúdo desse `echo`.

Existem também funções no PHP que podem enviar ou modificar cabeçalhos. Algumas dessas funções são:

- `header`
- `header_remove`
- `session_start`
- `setcookie`
- etc

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## Entendendo o problema

Como foi dito logo na introdução desse _post_, o problema "_Cannot modify header information - headers already sent_" acontece quando tentamos enviar um cabeçalho _HTTP_ após já termos enviado algo no corpo da resposta.

Isso quer dizer que esse erro acontece quando nós tentamos usar alguma função que adiciona ou modifica cabeçalhos _HTTP_ quando algum conteúdo já foi exibido. Se você executar o seguinte código em um contexto _web_, verá o erro em questão:

```php
<?php

echo 'Corpo da resposta';

header('Location: /url-de-redirecionamento');
```

O que nós estamos tentando fazer é enviar o cabeçalho `Location`, mas o corpo da resposta já começou a ser enviado quando nós executamos `echo`, ou seja, os cabeçalhos já foram montados e enviados para o cliente.

### Problema acontecendo mesmo sem echo ou HTML

Você talvez esteja se perguntando o motivo de já ter se deparado com esse erro mesmo sem ter, antes de uma função `header`, por exemplo, nenhuma exibição de conteúdo. Sendo assim, teoricamente, nenhuma resposta deveria ter sido criada e os cabeçalhos ainda não teriam sido enviados.

O que acontece é que não é incomum que nós geremos uma resposta mesmo sem querer. Se deixarmos espaços em branco antes da _tag_ de abertura do PHP (`<?php`) ou após a _tag_ de fechamento do PHP (`?>`), esses espaços serão exibidos e com isso os cabeçalhos serão enviados. Outro caso **muito comum** é se nossa aplicação gerar algum aviso (os famosos _warnings_ do PHP). Esses avisos sendo exibidos também geram uma resposta e com isso, os cabeçalhos são enviados.  

### Solução

Para que o erro não ocorra mais, você precisa se certificar que qualquer função que adiciona ou modifica cabeçalhos _HTTP_ (como `header` ou `session_start`) seja executada antes que qualquer coisa seja exibida, mesmo que de forma acidental.

Para isso, você pode:

1. Identificar e corrigir qualquer problema no código que gere algum erro ou aviso;
2. Mover as funções que adicionam ou modificam cabeçalhos _HTTP_ para o início da execução de sua aplicação, antes de qualquer exibição no corpo da resposta;
2. [Configurar o PHP](/2023-02-24-php-ini-conhecendo-as-configuracoes-do-php) para não exibir os erros e avisos (Isso só deve ser feito em produção. Em ambiente de desenvolvimento precisamos ver e corrigir os avisos);
3. Evitar o uso da _tag_ de fechamento do PHP (`?>`) em arquivos que contenham apenas código PHP;
4. Garantir que não há espaços antes da _tag_ de abertura (`<?php`) ou depois da tag de fechamento (`?>`) do PHP.
5. Controlar o [_output buffer_](/2020-11-03-wraper-de-streams-php) do PHP, caso se depare com um caso mais específico.

## Conclusão

Um dos erros mais conhecidos do mundo PHP, embora assustador, não é tão difícil de resolver. Com esse post você deve ter as informações necessárias para não se deparar com ele novamente e para resolver o problema caso o encontre.

Caso queira se aprofundar e conhecer ainda mais nos estudos sobre PHP, aqui tem um [cupom de desconto](https://tidd.ly/4d42Myb) para assinar a Alura, plataforma de cursos online onde eu sou o instrutor da maioria dos cursos de PHP.
