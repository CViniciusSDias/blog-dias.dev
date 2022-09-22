---
title: Programação procedural orientada a classes - Parte 2
date: "2020-04-16"
description: "Neste post nós vamos continuar a provocação sobre: será que você está usando programação orientada a objetos da forma correta? Será que não está apenas usando classes na programação procedural?"
tags: ["Programação procedural", "Orientação a objetos", "Dias de Dev"]
categories: ["Conceitos"]
---
## Design de código

Uma vez eu ouvi uma frase mas não me lembro o autor: "Não existe código sem design. Existe código com design ruim". Inclusive adaptei esta frase para "arquitetura" na primeira parte desta publicação.

Antes de falarmos sobre as péssimas decisões de design que tomamos, vamos falar sobre o que é design de código.

Uma analogia interessante foi feita pelo [Junior Grossi](https://twitter.com/junior_grossi) em um workshop maravilhoso de qualidade de código que fiz com ele. Foi mais ou menos assim (não com essas exatas palavras):

"Podemos fazer uma analogia da arquitetura de software com a arquitetura de uma casa. Onde fica cada cômodo, como se encaixam juntos, etc. É uma visão de bem **alto nível**. Já o design de código pode ser considerado análogo aos móveis de uma casa. É uma visão de mais **baixo nível** sobre nossas decisões sobre o código".

Então, basicamente (beem basicamente), arquitetura diz respeito a como você vai separar sua aplicação em camadas, por exemplo, onde cada camada pode ter sua responsabilidade bem definida. Já o design de código diz respeito a como você vai organizar suas classes e métodos em cada uma das camadas. Quais padrões você vai seguir, como cada classe vai se comportar sozinha ou em conjunto com suas respetivas dependências, etc.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## Escolhas corriqueiras

Agora que já entendemos basicamente o que é Design de Código, vamos falar sobre escolhas que fazemos frequentemente e que talvez não sejam as mais interessantes sob a ótica da programação orientada a objetos, ou melhor, sob a ótica do design orientado a objetos.

Como já foi discutido no post anterior, é muito comum termos um modelo anêmico: Classes que apenas possuem `getters` e `setters`, ou seja, meros sacos de dados. Para quem já estudou C sabe que no fundo isso não é uma classe, mas sim uma `struct`.

O fato de termos modelos anêmicos onde classes que deveriam ser do nosso domínio na verdade acabam sem nenhuma regra de negócio, geralmente faz com que nós transfiramos essas regras para lugares "errados" (entre aspas porque quem sou eu pra dizer o que é certo ou errado?).

Que lugares errados seriam esses?

## Helpers ou Utils

Quem nunca viu uma classe chamada `StringHelper` ou `DateUtils`? São classes que claramente estão perdidas em nosso sistema. O que seria, no mundo real, um(a) `StringHelper`? Se não existe no mundo real, tem certeza que deveria existir no código?

![Reflitão](https://i.imgur.com/rc9OMWr.jpg)

Esse tipo de classe é uma herança clara da programação procedural em nosso código onde estamos separando o comportamento dos seus dados, quando a orientação a objetos tem todas as ferramentas necessárias para nós os juntarmos.

### Possível solução

Se você possui uma classe `StringHelper`, talvez ela esteja fazendo validações bem genéricas. Nesse caso, nada mais justo do que transformá-la em uma classe bem genérica, como `String`. Nessa classe você pode ter comportamentos e verificações pertinentes a uma string em seu código.

Mas na maioria das vezes as verificações nesse tipo de classe são específicas de regras de negócio. Ex.: Garantir que nome possua pelo menos 10 letras.

Se é uma regra de negócio, deveria estar na classe de negócio. Talvez na classe `Pessoa`. Talvez numa classe mais específica, como `Nome`. Depende do seu sistema.

## Services inúteis

[O livro do Eric Evans sobre DDD](https://amzn.to/39MBuNH) é certamente uma obra que revolucionou o mundo do desenvolvimento. Eu particularmente ainda não o li, mas li [obras inspiradas por este livro](https://amzn.to/2Q1bW8d), então sei que: Neste livro foram definidos alguns conceitos sobre classes chamadas de `Services`.

Uma das possíveis "categorias" desse tipo de classe é `Application Service`. Este tipo de classe tem como propósito receber informações de fora do domínio do sistema (da web, linha de comando, etc) e orquestrar as chamadas a regras de domínio.

Um exemplo clássico:

```php
<?php

class AddUser
{
    private UserRepository $repository;
    private PasswordHasher $hasher;

    public function __construct(UserRepository $repository, PasswordHasher $hasher)
    {
        $this->repository = $repository;
        $this->hasher = $hasher;
    }

    public function execute(AddUserDto $data): void
    {
        $hashedPassword = $this->hasher
            ->hash($data->password());
        $user = new User($data->email(), $hashedPassword);

        $this->repository->add($user);
    }
}
```

Há pontos de melhoria nesse código (sempre há), mas basicamente: Ele recebe os dados de algum mecanismo de entrega através de um DTO (objeto de transferência de dados, que serve basicamente para transferir dados entre camadas no sistema), e passa para o domínio que sabe cifrar a senha, armazenar o usuário no repositório, etc.

### Problema comum

Essa definição de `Application Service` em algum momento foi tomada por alguém como "Classe obrigatória para adicionar _indireção_ desnecessária no sistema".

Na prática é muito comum vermos código onde um Controller chama um método de uma classe com `Service` no nome, e esse método não faz nada além de chamar um método de outra classe. Essa chamada extra de um método é conhecida como indireção, de forma resumida.

Algo parecido com isso:

```php
<?php

class UserService
{
    private UserRepository $repository;

    public function __construct(UserRepository $repository)
    {
        $this->repository = $repository;
    }

    public function add(User $user): void
    {
        $this->repository->add($user);
    }

    // todos os outros métodos públicos que também existem em UserRepository
}
```

Agora me responda: O que ganhamos ao ter a classe `UserService`? Ganhamos apenas mais indireções em nosso sistema. Mais um lugar que nossa IDE vai nos fazer passar até chegar no código que de fato executa algo.

Além de parecerem ser classes conhecidas como _God classes_, já que aparentam fazer tudo no sistema, são inúteis na prática.

Esse é mais um exemplo de programação procedural sendo aplicada, onde temos apenas funções sem nenhum significado pro negócio agrupadas em uma classe que simplesmente chama outras funções.

Outra característica de programação procedural nesse caso é que muito comumente temos métodos não tão relacionados na mesma classe `Service`.

É comum um `UserService` ter um método com uma chamada para salvar um usuário e outro método para enviar um e-mail para ele. Responsabilidades que deveriam estar em classes separadas.

No canal _Dev Eficiente_, do Aberto Souza, tem um vídeo falando um pouco mais sobre o problema deste tipo de classe, mas sob uma outra ótica. Vale a pena conferir:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/szGb93_hXgI" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Camada Model do MVC

Um ponto que tem levantado bastante discussão em comunidades que participo é: O que é a camada _Model_ no MVC?

Discutir sobre MVC é assunto pra outro post, mas o que tenho visto como consenso é: Camada que faz a persistência dos dados.

E a regra de negócio? Uma galera tem colocado nos _Controllers_. E aí? Se essa lógica precisar ser reaproveitada, como fazemos? Como chamamos um _Controller_ dentro de outro? Complicado, né?

Em nossos _Controllers_ é muito comum ver aquele código super famoso da programação procedural cheio de IFs e verificações em tipos primitivos, sem nenhum significado para o negócio.

### Padrões arquiteturais

Para "resolver" esse problema, diversos padrões arquiteturais existem, e eu falei um pouquinho (bem pouquinho) sobre arquitetura nesse meu outro post: [O que é Arquitetura](https://dias.dev/2020-04-10-o-que-e-arquitetura/)

## Conclusão

Por mais que a gente estude muito sobre ferramentas, frameworks, hypes e modinhas, os princípios da programação orientada a objetos mudam muito pouco e merecem MUITA atenção.

Estude conceitos, princípios, padrões... Tudo isso vai poder ser aplicado naquele framework que foi lançado semana passada e você está doido pra usar pra fazer um CRUD. Acredite.

Infelizmente eu ainda vejo muito código utilizando estas "técnicas" procedurais utilizando classes, e pessoas acreditando que isso é desenvolver utilizando a programação orientada a objetos.

Você costuma ver código assim no seu dia a dia? Compartilha aqui nos comentários algum caso que você tenha visto recentemente.
