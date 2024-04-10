---
title: "Por que não usar XAMPP"
date: "2021-04-10"
description: "Há diversas formas de trabalharmos com PHP e infelizmente uma das mais ensinadas é através do XAMPP. Neste artigo vamos resopnder a pergunta “Por que não usar XAMPP?”"
tags: ["PHP", "XAMPP", "Dias de Dev"]
categories: ["PHP"]
---
Umas das perguntas mais frequentes que vejo em comunidades de iniciantes em PHP são:
- Como instalar o XAMPP?
- Como configurar URLs amigáveis no XAMPP?
- Por que o MySQL não funciona com XAMPP?

A resposta que eu gostaria de dar geralmente é: “pare de usar XAMPP!”, mas sempre tento ajudar.

A ideia desse artigo é expor a razão para eu não recomendar XAMPP e acreditar que essa ferramenta traz muito mais
problemas do que solução.

## O que é e para que serve XAMPP?

Antes de falarmos os motivos de não usar XAMPP, é importante entendermos o que é a ferramenta. XAMPP é uma sigla para
**A**pache, **M**ySQL, **P**HP e **P**earl, sendo o **X** inicial para identificar que esta ferramenta é multiplataforma
(funciona em Windows, Linux e Mac).

## Qual o problema dessa abordagem?

Existem alguns problemas com o uso dessa ferramenta, principalmente por iniciantes (que são justamente o público alvo da
ferramenta).

### Processo de aprendizado

Ao aprender Java, C#, C ou alguma outra linguagem considerada mais _enterprise_, é comum aprendermos a sintaxe primeiro,
rodando simples códigos na linha de comando. Depois estudamos um pouco sobre o paradigma principal usado na linguagem e
só então, se for o caso de uma linguagem Web, aprendemos a usá-la na Web.

Por que um iniciante aprenderia a usar PHP na Web configurando um Apache e se conectando a um banco MySQL tudo de uma
vez só?

Infelizmente muitos treinamentos que encontramos pela internet são ministrados por pessoas que não se atualizaram e nem
ao menos trabalham com as tecnologias que se propõem a ensinar.

### Dificuldades desnecessárias

Supondo que você já conheça a linguagem e queira apenas um ambiente simplificado para continuar seus estudos. Como ter
Apache, MySQL e Pearl instalados na sua máquina pode te ajudar? Problemas de configuração no Apache, configurações
específicas para frameworks… Essas complicações infelizmente são muito comuns e geradas pelo XAMPP quando talvez tudo que
precisávamos era do PHP instalado.

## O que aprender primeiro?

Minha recomendação sempre é para aprender primeiro a linguagem que se vai utilizar. Como estamos falando do XAMPP,
aprender PHP. Estude a sintaxe da linguagem, entenda como aplicar os conceitos de lógica de programação usando a
linguagem. Estude sobre Orientação a Objetos, aprenda a organizar um código de exemplo. Só depois você vai pensar em
usar PHP no mundo da Web. E quando chegar o momento, você não vai sair de cara configurando um servidor Web como o
Apache.

## Como usar PHP sem XAMPP?

No capítulo anterior citei que primeiro os iniciantes deveriam estudar a sintaxe da linguagem e executar alguns códigos
na linha de comando, mas como rodar um código PHP sem XAMPP?

Simples: Instalando o PHP no seu computador.

Existem diversas maneiras de se usar o PHP em cada sistema operacional, então vou citar aqui algumas formas, mas não se
limite a elas.

### Como instalar PHP no Windows?

Para usar o PHP no Windows, tudo que precisamos fazer é baixar o executável na página oficial de downloads do PHP para
Windows: https://windows.php.net/download

Nesta página você terá acesso ao download de um zip, e neste zip você encontra o executável do PHP. Sendo assim, basta
extrair onde desejar que o PHP seja instalado e pronto. Desta forma, para executar o PHP, acesse no _Prompt de Comando_
a pasta em questão (usando o comando `cd`) e a partir de lá você poderá executar o comando `php`.

Para executar o PHP a partir de qualquer pasta no prompt de comando, você pode adicionar o caminho de instalação na
variável _PATH_ do sistema. Existem diversos tutoriais explicando o que é e como modificar a variável de sitema _PATH_,
mas se você quiser que eu fale disso, me conta nos comentários.

### Como instalar PHP no Linux?

A maioria das distribuições Linux já vêm com um pacote PHP pronto para ser instalado através do gerenciador de pacotes.
Em distribuições baseadas em _Debian_, por exemplo, basta executar `sudo apt install php` e você já terá o PHP instalado
em sua máquina.

Sempre há a opção de compilar o PHP de forma personalizada e eu recomendo fazer isso quando você já tiver mais intimdade
com a linguagem. É um bom aprendizado.

### Como instalar PHP no Mac?

No momento da escrita deste artigo o PHP já vem instalado no Mac por padrão. :-D

Porém via de regra uma versão mais antiga e com menos extensões vêm instalada, então o ideal é utilizar o Homebrew
para instalar o PHP e facilitar instalação de extensões no futuro.

## E como aprender Web sem Apache?

Se você tem o PHP na sua máquina você já tem também um servidor web instalado, sem precisar alterar arquivos de configuração, abrir
portas, etc. O PHP vem com um [servidor embutido](https://www.php.net/manual/en/features.commandline.webserver.php)
desde 2011 e ele serve exatamente para termos um ambiente web de desenvolvimento simplificado.

Além de servir conteúdos processados pelo PHP, este servidor também é capaz de servir arquivos estáticos e realizar
roteamento simples para um ponto de entrada em sua aplicação, por exemplo.

E claro, quando chegar o momento de sair do ambiente de desenvolvimento e aprender sobre realizar deploys, você vai
estudar sobre servidores Web. Muito provavelmente você vai se deparar com artigos sobre Nginx, PHP-FPM, etc. Mas isso é
assunto para outro momento, e não para o início do aprendizado em PHP.

## Como faço para sair de 2011 no PHP?

Se você percebeu que está aprendendo PHP de forma desatualizada e supercomplicada sem necessidade, não se preocupe nem
se sinta sozinho. Infelizmente a maioria de nós passou por isso. O primeiro passo para resolver um problema é entender
que há um problema.

Dado esse primeiro passo (inclusive, parabéns), vamos pesquisar materiais atualizados para aprendermos PHP como deve ser.

Um dos melhores livros que li como iniciante é o [Modern PHP](https://amzn.to/3fTOPaF).
Se preferir em Português, [PHP Moderno](https://amzn.to/3dLk4lx). Esse livro é de antes do PHP 7 ser lançado então ele
trata da evolução da linguagem sem entrar nos detalhes de sintaxes de 2016 pra cá.

A partir daí, caso você tenha aprendido a usar o PHP 5, se atualize nas novidades da linguagem. No momento da escrita
deste post nós estamos na [versão 8](https://youtube.com/playlist?list=PL3j2sfzg3FPuQXklYI2LumuG7jgZsj7cK). 

## Conclusão

XAMPP foi uma ferramenta que ajudou bastante gente que precisava de um ambiente de desenvolvimento web um pouco mais
simples antes de 2011, já que ele facilitava a instalação da praticamente a única opção do mercado: Apache.

Porém há 10 anos Apache não é mais necessário para um ambiente simples de aprendizado e desenvolvimento, e se o assunto
for um servidor de produção, XAMPP nunca foi uma alternativa viável. Sendo assim, para desenvolvedores PHP, não há
motivos válidos para uso do XAMPP nos dias atuais.

Se você quiser aprender mais sobre algum desses assuntos, pode considerar assinar a Alura. Lá existem treinamentos (gravados por mim) sobre PHP, Nginx e muito mais. Caso pretenda estudar na Alura, [neste link](https://tidd.ly/4d42Myb) você tem um desconto de 10%.
