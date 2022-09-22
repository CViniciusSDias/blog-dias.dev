---
title: Programação procedural orientada a classes - Parte 1
date: "2020-04-13"
description: "A programação orientada a objetos é muito citada e utilizada, mas será que você está fazendo da forma correta? Será que não está apenas usando classes na programação procedural?"
tags: ["Programação procedural", "Orientação a objetos", "Dias de Dev"]
categories: ["Conceitos"]
---
## Farsa da programação Orientada a Objetos

Acredito que todos concordamos que a programação Orientada a Objetos torna nosso código mais legível e permite arquiteturas mais interessantes do que a programação procedural, além de permitir recursos interessantes de reutilização de código.

Partindo desse pressuposto, também acredito que seja intenção de qualquer pessoa que trabalhe com desenvolvimento aprender mais e mais as técnicas e boas práticas deste paradigma de programação.

O problema acontece quando a gente vem de um aprendizado de programação procedural e tenta aplicar as mesmas técnicas fazendo uso de classes e objetos.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## Exemplo clássico

Há um exemplo muito clássico de um código que claramente, embora utilize classes e objetos, é procedural:

### Definição de uma classe

```php
<?php

class Pessoa
{
    private string $primeiroNome;
    private string $ultimoNome;
    private \DateTimeInterface $dataNascimento;

    public function setPrimeiroNome(string $primeiroNome): void
    {
        $this->primeiroNome = $primeiroNome;
    }

    public function getPrimeiroNome(): string
    {
        return $this->primeiroNome;
    }

    public function setUltimoNome(string $ultimoNome): void
    {
        $this->ultimoNome = $ultimoNome;
    }

    public function getUltimoNome(): string
    {
        return $this->ultimoNome;
    }

    public function setDataNascimento(\DateTimeInterface $dataNascimento): void
    {
        $this->dataNascimento = $dataNascimento;
    }

    public function getDataNascimento(): \DateTimeInterface
    {
        return $this->dataNascimento;
    }
}

```

### Utilização dela

```php
$pessoa = new Pessoa();
$pessoa->setPrimeiroNome('Vinicius');
$pessoa->setUltimoNome('Dias');
$pessoa->setDataNascimento(new \DateTimeImmutable('1997-10-15')); // aceito presentes

$idade = $pessoa->getDataNascimento()->diff(new \DateImmutable())->y;

echo "{$pessoa->getPrimeiroNome()} {$pessoa->getUltimoNome()} tem $idade anos";
```

### Problema

Olhando esse simples exemplo:

1. Você nota algum problema?
2. Identifica semelhança com algum pedaço de código que você tenha escrito recentemente?

Depois de você refletir um pouco, vamos continuar.

O código exemplificado utiliza uma classe `Pessoa` e a partir desta classe, cria um objeto. Logo, está utilizando do paradigma de programação orientada a objetos, certo? Errado!

Esse exemplo é claramente um código procedural que usa uma classe. Nada além disso.

## Proposta

Se você possui uma classe, os objetos gerados através dela devem ter seus comportamentos descritos (através de métodos) e não apenas fornecer os dados para realizar essas ações.

O código anterior poderia ser escrito da seguinte forma para usar o paradigma Orientado a Objetos:

```php
<?php

class Pessoa
{
    private string $primeiroNome;
    private string $ultimoNome;
    private \DateTimeInterface $dataNascimento;

    public function __construct(
        string $primeiroNome,
        string $ultimoNome,
        \DateTimeInterface $dataNascimento
    ) {
        $this->primeiroNome = $primeiroNome;
        $this->ultimoNome = $ultimoNome;
        $this->dataNascimento = $dataNascimento;
    }

    public function nomeCompleto(): string
    {
        return "{$this->primeiroNome} {$this->ultimoNome}";
    }

    public function idade(): int
    {
        $hoje = new DateTimeImmutable();
        
        return $this->dataNascimento->diff($hoje)->y;
    }
```

E assim poderíamos utilizar esta classe:

```php
<?php

$pessoa = new Pessoa('Vinicius', 'Dias', new \DateTimeImmutable('1997-10-15'));

echo "{$pessoa->nomeCompleto()} tem {$pessoa->idade()} anos.";
```

### Motivação da mudança

Com essa simples modificação nós não temos mais instâncias inválidas, já que agora toda `Pessoa` tem seu primeiro e último nome e sua data de nascimento. Antes, primeiro nós estávamos criando uma `Pessoa` em um estado inconsistente, sem seus dados, para depois defini-los.

Além disso, agora qualquer método que receba uma `Pessoa` por parâmetro não precisa saber se nesse objeto o nome completo está separado em primeiro e segundo nome ou não. Não precisa saber como o cálculo da idade é feito.

Caso a forma de apresentar o nome precise ser modificado (de "Vinicius Dias" para "Dias, Vinicius", por exemplo), podemos ir direto no ponto correto: O método `nomeCompleto`.

Embora seja um exemplo muito simples, ele mostra com clareza como normalmente escrevemos código acreditando estar utilizando a programação orientada a objetos.

Caso você tenha algum outro exemplo desse tipo em mente, já tenha visto algum código procedural com classes assim, ou tenha alguma outra sugestão de melhoria pra esse exemplo, que tal compartilhar com a gente aqui nos comentários?

## Princípios e padrões

Para nos ajudar a utilizar de forma mais "correta" a orientação a objetos, existem diversos padrões e princípios. Uns mais simples como o [Tell, Don't ask](https://youtu.be/7IXeLhpjk6g), outros mais completos e complexos como os [princípios SOLID](https://amzn.to/3Eplrm2).

Todos os princípios merecem uma atenção especial, porém isso foge do escopo deste artigo, mas uma rápida busca te mostra uma imensidão de conteúdo a respeito.

## Conclusão

Muito frequentemente nós utilizamos o paradigma procedural em nosso código e só pelo fato de termos classes definidas no código, achamos que estamos utilizando a Orientação a Objetos.

Este paradigma é muito mais do que apenas definir classes, atributos e métodos, logo, precisa de muito mais estudo do que apenas a leitura da documentação da sua linguagem favorita para aprender a sintaxe.
