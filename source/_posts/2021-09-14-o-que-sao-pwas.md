---
title: "O que são PWAs?"
date: "2021-09-14"
description: "Entenda o que são as PWAs (Progressive Web Apps) e suas vantagens sobre a criação de aplicativos móveis"
tags: ["PWA", "Dias de Dev"]
categories: ["Web", "Front"]
---
_Progressive Web Apps_, como o nome mesmo já diz, são aplicativos _web_ progressivos. Vamos falar um pouco mais sobre a parte de "progressivos", mas o básico é isso: Um aplicativo que roda no "mundo _web_"

## Aplicativo na Web?

Quando falamos de aplicativos, principalmente móveis, pensamos logo em acessar uma loja de aplicativos, escolher um disponível e instalar. Pensamos em todo o poder que estes aplicativos têm de controlar o _hardware_ de nossos dispositivos. Mas será que precisa ser assim?

Primeiro, precisamos mesmo de uma loja? Por que não pesquisar diretamente no Google um serviço ao invés de pesquisar em uma loja de aplicativos? Segundo, será que só aplicativos móveis "nativos" são capazes de controlar o _hardware_ dos dispositivos onde eles rodam?

<img src="https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1DKtUFjXLJbiiruKA9P1.svg" alt="Gráfico mostrando a relação entre capacidade e alcance de PWAs e aplicações nativas e serviços web, onde PWAs possuem tanta capacidade quanto um aplicativo nativo e tanto alcance quanto um serviço Web" class="big-image" />

<ins class="adsbygoogle"
style="display:block; text-align:center;"
data-ad-layout="in-article"
data-ad-format="fluid"
data-ad-client="ca-pub-8918461095244552"
data-ad-slot="2366637560"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>

## O poder da Web

A _Web_ evoluiu absurdamente nas últimas décadas e trouxe muito poder para nós _devs_. Coisas que antigamente seriam impensáveis sem instalar de forma "nativa" uma aplicação, hoje é trivial de ser feito diretamente no navegador. Alguns exemplos:

- Acessar à câmera;
- Disponibilidade offline;
- Acesso ao GPS;
- Execução de tarefas no plano de fundo;
- etc.

Hoje em dia é perfeitamente possível que após acessar um aplicativo _web_, os próximos acessos possam ser feitos sem uma conexão ativa com a _internet_. Além disso é muito comum aplicativos _web_ acessarem recursos nativos como localização, sistema de sons, baterias, etc.

Aqui você pode conferir algumas _APIs Web_ para ter acesso a recursos que antigamente só eram possíveis através de aplicações nativas: https://developer.mozilla.org/en-US/docs/Web/API

## Aplicações progressivas

Já vimos que através da _Web_ podemos ter acesso a recursos muito poderosos, mas o que significa o **P** de PWA?

PWAs são aplicações progressivas, ou seja, se adaptam a diferentes cenários e dispositivos.

Um exemplo já citado de cenário adverso: dispositivo sem conexão com a _internet_. Quando você acessa o aplicativo móvel do Twitter sem estar conectado a _internet_, ele te mostra os _tweets_ que já foram carregados anteriormente. Ou seja, a sua experiência é degradada, mas o aplicativo continua funcionando. A ideia de PWAs é exatamente essa.

Se você tentar acessar uma PWA que precisa da localização do usuário a partir de um dispositivo sem GPS, a aplicação deve estar preparada para buscar a localização menos precisa (através da rede) ou solicitar o endereço ao usuário. Com isso, quanto mais recursos o dispositivo tiver, melhor será a experiência. Em outras palavras, teremos uma experiência **progressiva**.

## Posso instalar "sites"?

Uma dúvida comum ao aprender sobre PWAs é sobre a instalação da aplicação. Não seria prático que um usuário precisasse abrir o navegador e digitar a URL da nossa aplicação sempre que quisesse acessá-la. Com aplicativos nativos nós temos os ícones na tela inicial do dispositivo.

Outro ponto é que um aplicativo possui uma experiência mais imersiva, sem interferências de outras abas do navegador, além de barras de ferramentas, etc.

<img src="/build/pwa/pwa-ifood.jpg" alt="Tela da PWA do ifood, que é exatamente igual ao aplicativo nativo" class="big-image" />

Como podemos ver, uma PWA pode se comportar visualmente exatamente como uma aplicação nativa. As barras do navegador podem sumir, a cor da barra de notificação pode ser personalizada, etc.

Além do mais, podemos optar por criar um atalho para essa aplicação web direto em nossa tela inicial:

<img src="/build/pwa/menu-instalar-ifood.jpg" alt='Tela do navegador com o menu aberto, mostrando a opção de "Adicionar à tela inicial"' class="big-image" />

Mas claro, nem todo usuário vai abrir o menu do navegador para adicionar um atalho à tela inicial. O ideal seria poder ter um botão de instalar essa aplicação para que o usuário não tenha esse "esforço".

<img src="/build/pwa/tela-instalacao-uber.jpg" alt="Mensagem sugerindo a instalação da PWA do uber sem precisar abrir o menu do navegador" class="big-image" />

Conforme podemos ver na imagem anterior, isso também é perfeitamente possível. Além de termos um botão na aplicação para instalá-la, o próprio navegador ao identificar uma PWA pode sugerir sua instalação. A ideia é que isso fiquei cada vez mais natural, inclusive, com os navegadores tomando decisões mais assertivas ao fazer tais sugestões.

## Como desenvolver PWAs?

Como sou um desenvolvedor Web, o assunto de PWAs me anima bastante. A ideia deste post não é te ensinar a desenvolver PWAs, mas sim te apresentar ao conceito. Caso você tenha interesse na parte prática, vou deixar aqui algumas referências.

Se você aprende melhor lendo, esse livro é um ótimo início:

<div class="iframe">
    <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=BR&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=cviniciussd06-20&language=pt_BR&marketplace=amazon&region=BR&placement=B07BZK71NV&asins=B07BZK71NV&linkId=39b9fcf31f08c2d76b0d6f4284cb6a60&show_border=true&link_opens_in_new_window=true"></iframe>
</div>

Porém uma desvantagem (na minha opinião) deste livro é o uso de React para a criação da aplicação. Eu gosto mais de conteúdos conceituais, que explicam a base sem o uso de muitas ferramentas. 

Se você também prefere esse tipo de conteúdo, pode dar uma olhada nesse livro (um pouco mais caro):
<div class="iframe" style="margin-bottom: 1rem;">
    <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=BR&source=ss&ref=as_ss_li_til&ad_type=product_link&tracking_id=cviniciussd06-20&language=pt_BR&marketplace=amazon&region=BR&placement=B075HP52WY&asins=B075HP52WY&linkId=955ce63a435057d47ccd0bd81620193c&show_border=true&link_opens_in_new_window=true"></iframe>
</div>

Agora se você prefere estudar através de cursos e vídeos, super recomendo os treinamentos de front-end e de PWA da Alura. Lá você consegue toda a base para desenvolver uma PWA de forma profissional, aprendendo desde a base, passando por _JavaScript_ avançado e _APIs Web_, até _PWAs_ de fato. Se for o seu caso, aqui tenho um cupom de 10% de desconto para estudar na Alura:
[https://www.alura.com.br/promocao/diasdedev](https://www.alura.com.br/promocao/diasdedev)
