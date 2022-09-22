---
title: O que é arquitetura
date: "2020-04-10"
description: "O que é Arquitetura? E design de código, é a mesma coisa? Nesse post você vai entender o básico do que é Arquitetura de Software e alguns casos reais de aplicação."
tags: ["Arquitetura de software", "Design de código", "Dias de Dev"]
categories: [Conceitos]
---

## Problema

Imagine que no momento da escrita desse artigo (ano de 2020) você esteja criando um sistema para a empresa que te contratou como desenvolvedor(a). Nesse sistema você pode utilizar todas as novas tecnologias, pode decidir como vai organizar o código, enfim, o sonho de qualquer pessoa que trabalha na área.

Como você trabalha com PHP, escolhe o framework que está "na boca do povo": Laravel. Começa o desenvolvimento e rapidamente entrega uma primeira versão do projeto. A equipe de negócios está feliz com toda a velocidade de entrega e a equipe técnica está feliz de utilizar um framework da moda.

Os anos se passam. No futuro, você precisa dar manutenção em um sistema que usa uma versão mega desatualizada do framework já que eles decidiram trocar a ferramenta que fazia o acesso ao banco de dados, e toda a regra de negócios da aplicação está em "models" do Eloquent.

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## Mundo real

Parece irreal, né!?

"Ah, mas o Laravel não vai deixar de usar o Eloquent. Não faz sentido esse exemplo"

Bom, hoje eu trabalho em uma empresa que tem um software funcionando desde o PHP 3.

Em algum momento da vida desse software, acharam uma boa ideia atrelar as regras de negócio a um projeto conhecido como Pear DB. Esse projeto hoje não recebe atualizações (apenas correções de segurança), além de nos deixar "amarrados" a sua filosofia de código, que difere do que temos nos mundos atuais de PSRs, Composer, etc.

Resultado: O sistema evolui. Novas funcionalidades são adicionadas todo dia. A equipe de negócios continua recebendo suas demandas, mas como a forma de desenvolver não evoluiu junto com o conhecimento e ferramentas atuais, o prazo já não é o mesmo.

Além disso, novos integrantes da equipe sofrem para entender todo o espaguete que o código virou. Caos!

## Como poderia ter sido?

Se os arquitetos desse sistema pudessem voltar no tempo, o que fariam, você pode se perguntar. Minha ideia aqui é levantar algumas opções.

Em termos de código, entidades poderiam ter sido criadas sem nenhum conhecimento da infraestrutura que cuida da persistência. Se é utilizado Pear DB, PDO, Doctrine, Eloquent, uma API, um arquivo com os dados, tanto faz. A lógica de negócios estaria intacta.

E para salvar no banco? Classes especializadas nessa tarefa, também conhecidas como repositórios, poderiam ter sido utilizadas. Essas classes saberiam lidar com as entidades e fazer a tradução necessária para o sistema de persistência (usando SQL, por exemplo).

E se a ferramenta usada fosse descontinuada? Bom, simples: Poderíamos criar uma `interface` que define o que um repositório deve saber fazer. Quando o Pear DB deixasse de receber suporte, nossa classe `PearDbQuestionRepository` (repositório de perguntas) poderia ser fácilmente substituída por uma classe `PdoQuestionRepository`, ou até mesmo `DoctrineQuestionRepository`. Isso não faria diferença para as regras de negócio, que precisavam de qualquer implementação da interface `QuestionRepository`.

## O que isso tem a ver com arquitetura?

— Essa solução proposta é perfeita?<br>
— Longe disso! Tem suas vantagens e desvantagens

Decisões de como organizar nosso código de forma que ele continue "utilizável" após determinado período é o propósito mais simples de uma arquitetura.

Arquitetura, segundo nosso querido Google, é: "arte e técnica de organizar espaços e criar ambientes para abrigar os diversos tipos de atividades humanas, visando tb. a determinada intenção plástica."

Se trazemos isso para o mundo do desenvolvimento temos uma definição semelhante à seguinte: "A arquitetura de software de um sistema consiste na definição dos componentes de software, suas propriedades externas, e seus relacionamentos com outros softwares."

Você pode encontrar inúmeras definições para esse termo, mas em sua essência, arquitetura de software nos ajuda a definir como organizar nosso código, torná-lo mais compreensível, manutenível a longo prazo, e separar a responsabilidades de domínio (regras de negócio) da infraestrutura (banco de dados, log, envio de e-mails, etc).

## Padrões arquiteturais

O exemplo que eu dei é bem raso e cita apenas um pequeno problema que uma arquitetura bem feita visa resolver. Para resolver diversos outros problemas, padrões arquiteturais surgiram ao longo do tempo.

Você muito provavelmente conhece pelo menos um (nem que seja de nome), e aqui cito nomes de padrões arquiteturais bem famosos:

- MVC (o famoso Model-View-Controller)
- ADR (Action-Domain-Response, uma espécie de evolução do MVC para web)
- [SOA (Arquitetura orientada a serviços)](https://amzn.to/3Do3e7h)
- [Clean Architecture](https://amzn.to/3dljwDj) (em português, [Arquitetura Limpa](https://amzn.to/3fqp69x))
- Hexagonal Architecture (em português, Arquitetura Hexagonal)
- Onion Architecture (em português, Arquitetura em Camadas (cebola))

Citar especificidades de cada padrão e suas semelhanças / diferenças fogem do escopo desse post, mas é interessante conhecer e se adaptar com alguns nomes.

## Conclusão

Não existe sistema sem arquitetura, só sistema com arquitetura ruim.

Mesmo que no desenvolvimento de um sistema você não siga nenhum padrão arquitetural, há decisões de arquitetura no código, e se mal feitas, essas decisões podem te assombrar por muito MUITO tempo.
