---
title: "Cookies e segurança"
date: "2022-09-27"
description: ""
tags: ["Front", "Cookies", "Segurança", "Dias de Dev"]
categories: ["Front", "Conceitos"]
---

_Cookies_ são amplamente utilizados para armazenar informações em nossos navegadores e muitas vezes nós negligenciamos a segurança dessas informações. Cookies podem conter dados sensíveis como sua informação de sessão, por exemplo, por isso devemos nos preocupar com seu armazenamento.

## O que são _cookies_?

Um _cookie_ é, basicamente, uma informação de texto enviada pelo servidor de uma aplicação web e salva no navegador. Após salvar essa informação, o navegador reenvia os _cookies_ em todas as requisições realizadas. _Cookies_ são enviados através de cabeçalhos HTTP tanto do servidor para o cliente quanto do cliente para o servidor.

Se você não está familiarizado com o protocolo HTTP, pode conferir este vídeo antes de continuar a leitura:

<iframe width="560" height="315" src="https://www.youtube.com/embed/B2IWlnJ_dt0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 

Dessa forma um servidor pode, por exemplo, ao receber as credenciais do usuário, gerar um ID único e enviar através de cookies. A partir disso, todas as requisições futuras que o navegador fizer conterão essa identificação do usuário. Assim funciona o mecanismo de sessões que nos permite permanecer logados em sites.

### Onde ficam os _cookies_

Cada navegador pode salvar seus _cookies_ como preferir. Seja em um banco de dados embutido, em arquivos de texto encriptados no sistema operacional, etc. Mas para visualizar os cookies de uma aplicação que estamos acessando, podemos utilizar as ferramentas de desenvolvedor.

Aperte F12, vá até a aba "Aplicativo" (ou "Application") e lá você verá, no menu lateral, a parte de _Cookies_. Repare que eles são separados por domínio. 

Para entender essa separação por domínio, vamos imaginar o seguinte cenário: sua aplicação, hospedada no domínio X, envia um _cookie_ de identificação de sessão. No código do seu app há uma requisição para um script que configura relatórios de acesso ao site. Esse script está em outro site, no domínio Y. Sendo assim, você verá _cookies_ dos domínios X e Y ao acessar essa ferramenta de desenvolvedores.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

### O que _Cookies_ armazenam

Entendido o funcionamento básico e onde encontrá-los, vamos analisar quais informações um _cookie_ pode conter. Todo cookie possui, necessariamente, um nome e um valor. O nome é, como você deve imaginar, a forma que usamos para identificar a informação que esse cookie carrega em seu valor. Um _cookie_ de sessão, por exemplo, geralmente possui a palavra _session_ em seu nome enquanto seu valor será o ID da sessão.

Além desses atributos "básicos", cookies podem possuir parâmetros extra. Alguns deles são:
- `Expires`: Define a data e hora de expiração do cookie. Se esse parâmetro não for definido, o _cookie_ será considerado como "_cookie_ de sessão" e irá expirar quando o navegador for fechado.
- `Max-Age`: Similar ao `Expires`, também define quando um _cookie_ vai expirar, mas em segundos. Se os 2 parâmetros forem informados, `Max-Age` possui precedência.
- `Domain`: Define para qual host o _cookie_ será enviado pelo navegador. Se esse parâmetro não for definido, o _cookie_ será enviado somente para o host da URL atual, não incluindo sub-domínios. Se um valor como `example.com` for definido, o _cookie_ será enviado nas requisições para `example.com` e todos os seus sub-domínios.
- `Path`: Indica qual caminho deve existir na URL para que o _cookie_ seja enviado pelo navegador. Se o valor for `/docs`, o _cookie_ será enviado para URLs como `/docs`, `/docs/`, `/docs/web`, etc, mas não será enviado para URLs como `/`, `/documentos`, `/pt-br/docs`, etc.
- `Secure`: Se esse parâmetro for definido, o _cookie_ só será enviado em requisições HTTPS.
- `HttpOnly`: Proibe o acesso ao _cookie_ em questão através de JavaScript com `document.cookie`. 
- `SameSite`: Com os possíveis valores sendo `Strict`, `Lax` e `None`, controla se o _cookie_ pode ser enviado em requisições feitas a partir de outros sites para o do domínio do _cookie_.

#### Exemplos de definições de _cookies_

Para enviar um _cookie_ de sessão, o seguinte cabeçalho pode ser enviado:
```
Set-Cookie: sessionId=123456
```

Já para um _cookie_ permanente com duração de 1 semana:
```
Set-Cookie: nome=valor; Max-Age=604800
```

## _Cookies_ e Segurança

Já entendemos o que são, como funcionam e os parâmetros de _cookies_. Agora vamos finalmente ao tópico em questão: _cookies_ e segurança.

### _Cookies_ e XSS

Como já foi citado, sessões são um uso muito comum para _cookies_. As linguagens de back-end, inclusive, já lidam com esse detalhe de forma transparente na maioria das vezes. Agora imagine o seguinte cenário: através de um ataque de [XSS](https://www.youtube.com/watch?v=lntsVxPZibw) um usuário malicioso consegue acesso ao seu _cookie_ de sessão. Com isso ele conseguirá se passar por você e o estrago pode ser enorme.

Para prevenir que ataques XSS consigam acessar seus _cookies_ sensíveis (como o de sessão), podemos marcá-lo como `HttpOnly`. Dessa forma, código JavaScript nenhum terá acesso ao mesmo.

Claro que um sistema com vulnerabilidade a _XSS_ está em GRANDES riscos, mas para evitar _session hijacking_, tornar o _cookie_ `HttpOnly` já é um grande passo.

Como já foi explicado anteriormente, o parâmetro `HttpOnly` impede que o _cookie_ em questão seja acessado via `document.cookie`. Mas caso você precise realizar requisições via JavaScript, saiba que a função `fetch` vai conseguir enviar os mesmos sem problema. :-D

Cada linguagem back-end pode fornecer suas facilidades para definir o _cookie_ de sessão como `HttpOnly`. No PHP, por exemplo, além da função `session_set_cookie_params`, há configurações como a `session.cookie_httponly`. O cabeçalho de um _cookie_ `HttpOnly` seria parecido com:

```
Set-Cookie: sessionId=123456; HttpOnly
```

### _Cookies_ e CSRF

Um ataque _CSRF_ (_Cross-Site Request Forgery_) permite que um atacante se passe por outro usuário tabmém, enviando requisições de um site para outro.

Para exemplificar: imagine que meu site dias.dev seja malicioso. Nele eu vou colocar a seguinte tag `img`:
```html
<img src="https://example.com/index.php?action=delete&id=123" />
```
Se você, acessando meu site, estiver logado em `example.com` (com o _cookie_ armazenado), essa requisição vai ser feita com sucesso para uma ação de remoção de um dado e você nem vai perceber. Só haverá uma "imagem quebrada" no site.

Para impedir que a partir de um site, _cookies_ sejam enviados para outro, podemos (dentre outras coisas), definir a política de `SameSite`:
```
Set-Cookie: sessionId=123456; HttpOnly; SameSite=Strict
```

Agora nosso _cookie_ além de não ser mais acessível via JavaScript, só é enviado em requisições realizadas a partir do nosso próprio site.

### _Cookies_ e ataques _Man in the middle_

Outra forma de realizar _session hijacking_ seria um ataque do tipo _Man in the middle_, onde um atacante observa as requisições realizadas a partir do seu computador para o servidor. Se a requisição não for criptografada, ou seja, não usar HTTPS, o atacante terá acesso a todos os _cookies_.

Para impedir que um _cookie_ seja enviado em requisições não criptografadas, basta definir o parâmetro `Secure`. Quando uma requisição sem HTTPS acontecer, esse _cookie_ não será enviado. Com isso, nosso `header` ficaria:

```
Set-Cookie: sessionId=123456; HttpOnly; SameSite=Strict; Secure
```

## Conclusão

Repare que o uso correto dos parâmetros dos _cookies_ já nos protege de diversos ataques. Obviamente apenas cuidar dos nossos _cookies_ não é o suficiente para ter um sistema verdadeiramente seguro. Precisamos nos atentar a diversos outros fatores e possíveis vulnerabilidades. Além disso, _cookies_ de sessão não são os únicos a serem cuidados. _Tokens_ geralmente são armazenados como _cookies_ também e todos esses cuidados devem ser tomados.

Se segurança é um assunto que te interessa, recomendo essa _playlist_ com alguns vídeos básicos sobre o assunto: https://www.youtube.com/playlist?list=PL3j2sfzg3FPuOOt13tOcNTx6hCFYcQls9

Se quiser se aprofundar, na Alura há diversos cursos e formações sobre o tema de segurança. Aqui está um cupom de desconto para assinar a plataforma:
https://www.alura.com.br/promocao/diasdedev
