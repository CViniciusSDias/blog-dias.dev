---
title: "Kubernetes para Iniciantes: Conceitos Básicos e Aplicações Práticas"
date: "2024-07-16"
description: "Descubra o que é Kubernetes e como ele simplifica a gestão de aplicações em contêineres. Este guia para iniciantes explora os conceitos essenciais do Kubernetes, incluindo pods, serviços e escalabilidade automática, preparando você para entender seu papel fundamental na moderna arquitetura de aplicações."
tags: [
    "Kubernetes",
    "Orquestração de contêineres",
    "Contêineres Docker",
    "Deployment Kubernetes",
    "Pods Kubernetes",
    "Serviços Kubernetes",
    "Escalabilidade automática Kubernetes",
    "Orquestrador de contêineres",
    "Cloud-native",
    "Microserviços",
    "DevOps",
    "Gerenciamento de aplicações",
    "Dias de Dev"
]
categories: ["Conceitos"]
---

Kubernetes, ou para abreviar, k8s, é um orquestrador de contêineres. Nesse texto eu vou te explicar o que isso significa e em que cenários ele é útil. Esse post **não é um tutorial** de como usar o Kubernetes, mas sim uma explicação de conceitos.

## O que é k8s

Como eu já disse, Kubernetes é um orquestrador de contêineres. Mas o que isso significa? Vamos por partes.

### O que são contêineres

O kubernetes vai te ajudar a organizar uma aplicação executada em um ambiente de contêineres (_containers_), geralmente utilizando Docker. Um _container_ é uma forma de empacotar uma aplicação com todas as suas dependências, de forma que ela possa ser executada em qualquer ambiente que tenha o Docker instalado. Isso é muito útil para garantir que a aplicação vai funcionar da mesma forma em qualquer lugar.

De forma super simplificada, um _container_ é como se fosse uma máquina virtual muito mais leve, pois pode compartilhar recursos do sistema operacional onde ele está sendo executado.

### Docker compose

Uma aplicação geralmente possui mais de um _container_. Nós temos, por exemplo, um _container_ para a aplicação em si, um para um servidor web, outro para um sistema de mensageria, e assim por diante. O Docker Compose é uma ferramenta que nos ajuda a definir e executar aplicações com múltiplos _containers_.

Mas para execução de uma aplicação como essa em ambiente de produção, o Docker Compose apresenta limitações. Se um _container_ falhar, ele não será reiniciado automaticamente. Se você quiser escalar a aplicação, você terá que fazer isso manualmente. E se você quiser atualizar a aplicação, você terá que fazer isso manualmente também. Para automatizar essas tarefas, precisamos de um orquestrador de _containers_ mais robusto.

### Orquestração

A orquestração de _containers_ é o processo de gerenciar a execução de múltiplos _containers_ em um ambiente de produção. Isso inclui tarefas como:

- Monitorar os recursos utilizados por cada _container_;
- Escalar automaticamente o número de _containers_ caso necessário;
- Reiniciar um _container_ em caso de falhar;
- Permitir a atualização de uma aplicação sem downtime;
- Expor uma forma de acessar os _containers_ sem precisar saber em qual máquina eles estão rodando.

Existem alguns orquestradores de _containers_ no mercado, como o Docker Swarm, o Apache Mesos e o Kubernetes. O Kubernetes é o mais popular deles, sendo sobre ele que vamos falar aqui.

## Conceitos de kubernetes

### Cluster

Um cluster Kubernetes nada mais é do que um ambiente onde você vai executar suas aplicações. Esse ambiente precisa estar configurado para que o Kubernetes consiga ter acesso para gerenciar os diversos recursos que sua aplicação vai precisar.

Para executar os recursos necessários para sua aplicação, obviamente você vai precisar de máquinas. Essas máquinas podem ser disponibilizadas de diversas formas diferentes. Cada ambiente pode disponibilizar um cluster de forma diferente, ou você mesmo pode configurar um cluster de forma que acesse os recursos dessas máquinas de formas diferentes.

Ambientes em nuvem, como AWS, Azure, Google Cloud Platform, Digital Ocean e vários outros, disponibilizam clusters gerenciados de kubernetes para facilitar a configuração. Caso prefira, você também pode configurar manualmente um cluster de kubernetes. Inclusive, para executar um cluster localmente, normalmente nós configuramos um cluster de forma simplificada utilizando ferramentas como Minikube ou Kind.

Um cluster Kubernetes é composto por _Nodes_, que basicamente são as máquinas que executaram a sua aplicação. Existem os _master nodes_ e _worker nodes_. Os _master nodes_ são responsáveis por gerenciar o cluster, realizando as ações de criar, reiniciar e remover recursos, enquanto os _worker nodes_ são responsáveis por efetivamente executar os recursos que rodarão a aplicação.

Vamos entender um pouco melhor sobre o que são esses "recursos".

### Pod

Um _Pod_ é a menor unidade de execução no Kubernetes. Ele é composto por um ou mais _containers_ que compartilham recursos, como rede e armazenamento. Normalmente, um _Pod_ contém apenas um _container_, mas é possível ter mais de um _container_ em um _Pod_.

Para resumir, um _Pod_ é uma casca que envolve um _container_ da sua aplicação e permite que o Kubernetes faça a gestão.

### Service

Quando trabalhamos com _containers_ localmente, podemos acessá-los diretamente de nossa máquina a partir de portas mapeadas. Quando trabalhamos em um cluster Kubernetes, nós precisamos expor o acesso aos _Pods_ de uma forma mais organizada. Para isso utilizamos _Services_.

Um _service_ pode expor um _Pod_ somente para outros _Pods_ dentro do mesmo cluster ou para fora, permitindo acesso externo (via internet). Ele é uma forma de abstrair o acesso a um _Pod_, permitindo que ele seja acessado de forma mais organizada.

### Deployment

Algo que foi citado anteriormente é que o Kubernetes permite que você atualize sua aplicação sem downtime. Para isso, você pode utilizar um _Deployment_. Um deployment garante que um número específico de _Pods_ esteja sempre rodando. Se você atualizar a imagem de um _container_ em um _Deployment_, o Kubernetes vai criar novos _Pods_ com a nova imagem e remover os antigos, garantindo que a aplicação esteja sempre disponível.

Existem diversas estratégias para que um _deployment_ seja feito, mas o padrão já permite que você faça isso sem downtime.

### Autoscaling

O Kubernetes permite que você configure regras para que o número de _Pods_ seja aumentado ou diminuído automaticamente. Isso é muito útil para aplicações que possuem picos de acesso em determinados momentos do dia, por exemplo, ou para garantir que sua aplicação esteja pronta para receber um número inesperado de acessos.

Isso pode ser feito através de um recurso chamado _Horizontal Pod Autoscaler_ (HPA).

Outra possibilidade de escalabilidade é a vertical, que é aumentar a capacidade de uma máquina. O Kubernetes também permite que você configure regras para que o tamanho de um _Pod_ seja aumentado ou diminuído automaticamente. Isso é feito através de um recurso chamado _Vertical Pod Autoscaler_ (VPA). Embora seja menos comum, não deixa de ser uma alternativa.

## Como k8s é utilizado

Em uma aplicação executada via kubernetes, normalmente você vai ter um cluster configurado localmente com ferramentas que simplificam esse trabalho, como Minikube ou Kind. Além disso, o ambiente de produção precisa também de um cluster configurado, mas de forma muito mais robusta. Como já foi dito, ambientes em nuvem disponibilizam clusters gerenciados de kubernetes para facilitar essa configuração, mas nada te impede de realizar toda a configuração de um cluster manualmente.

### Acesso às funcionalidades

Para acessar as funcionalidades que um cluster kubernetes expõe, como por exemplo, criar pods, services e deployments, você pode utilizar a linha de comando, através do `kubectl`, que é a ferramenta oficial de linha de comando do Kubernetes.

Com essa ferramenta você pode tanto realizar alterações em seu cluster local como realizar deploys automatizados no ambiente de produção.

### Arquivos de configuração

Para facilitar a criação de recursos no Kubernetes, é possível criar arquivos de configuração que descrevem o que você quer que seja criado. Esses arquivos são escritos em YAML e são passados para o `kubectl` para que ele possa criar os recursos no cluster.

Um exemplo bem básico de uma aplicação Kubernetes que garante deploy sem _downtime_ e assegura que sempre hajam 3 réplicas da mesma sendo executadas além de ser exposta para internet pode ser visto no arquivo abaixo:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: deployment-da-aplicacao
spec:
    replicas: 3
    selector:
        matchLabels:
            app: minha-aplicacao
    template:
        metadata:
            labels:
                app: minha-aplicacao
        spec:
            containers:
                - name: container-minha-aplicacao
                  image: imagem-docker-minha-aplicacao:latest
                  ports:
                      - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
    name: svc-minha-aplicacao
spec:
    selector:
        app: minha-aplicacao
    ports:
        - protocol: TCP
          port: 80
          targetPort: 8080
    type: LoadBalancer
```

Com um simples comando `kubectl apply -f arquivo.yaml`, desde que o `kubectl` esteja corretamente configurado para acessar o _cluster_, todas as configurações descritas no arquivo serão aplicadas no cluster.

## Conclusão

Obviamente isso não é tudo que se há para saber sobre Kubernetes. Mesmo conceitos básicos como ConfigMap e Secrets foram deixados de fora para manter o texto breve. Mas a ideia por trás da ferramenta é essa: permitir que você gerencie sua aplicação de forma mais organizada, escalável e resiliente.

Caso você queira aprender mais sobre Kubernetes, colocando a mão na massa e aplicando os conceitos desse texto e muitos outros, a Alura possui diversos cursos sobre o assunto e aqui você tem [15% de desconto](https://tidd.ly/3WmC1yi) para assinar a plataforma.
