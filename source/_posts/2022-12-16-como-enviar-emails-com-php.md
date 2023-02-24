---
title: "Enviando e-mails com PHP: uma introdução à função mail e ao SMTP"
date: "2022-09-27"
description: "Enviar e-mails é uma tarefa muito comum em aplicações Web, e o PHP fornece maneiras muito simples de atingirmos esse objetivo. Nesse post, vamos explorar como enviar um e-mail com PHP indo desde o uso da função `mail` até o uso de componentes externos como PHPMailer"
tags: ["PHP", "ChatGPT", "Dias de Dev"]
categories: ["PHP"]
---

> Disclaimer: *Esse post foi escrito pela inteligência artificial do [ChatGPT](https://chat.openai.com/chat) contendo apenas poucas alterações feitas por mim (Vinicius)*

Enviar e-mails é uma tarefa comum em muitos aplicativos web, e o PHP oferece uma função nativa chamada `mail` que pode ser usada para enviar mensagens de e-mail de forma relativamente simples. No entanto, a função `mail` tem algumas limitações e pode não ser a opção mais adequada para todos os casos de uso. Neste post, vamos explorar como a função `mail` funciona e quando é adequada usá-la, além de introduzir o conceito de Simple Mail Transfer Protocol (SMTP) e apresentar algumas opções de bibliotecas de envio de e-mails como PHPMailer e Symfony Mailer.

## A função `mail` do PHP

A função `mail` do PHP é uma forma simples de enviar e-mails usando a linguagem. Ela é chamada da seguinte maneira:

```php
mail($to, $subject, $message, $headers, $parameters);
```

Onde:

- `$to` é o endereço de e-mail do destinatário
- `$subject` é o assunto da mensagem
- `$message` é o corpo da mensagem
- `$headers` são cabeçalhos adicionais que podem ser incluídos na mensagem, como o endereço de e-mail do remetente ou o tipo de conteúdo da mensagem
- `$parameters` são parâmetros adicionais que podem ser passados para a função

A função retorna `true` se a mensagem for enviada com sucesso e `false` caso contrário.

### Como a função `mail` funciona por baixo dos panos

Quando você chama a função `mail` do PHP, ela usa o programa sendmail instalado no servidor para enviar a mensagem. Isso significa que, para que a função `mail` funcione, é necessário que o sendmail esteja configurado e funcionando corretamente no servidor. Além disso, o endereço de e-mail do remetente da mensagem precisa ser válido e o servidor precisa ter permissão para enviar e-mails em nome desse remetente.

### Limitações da função `mail`

Apesar de ser uma opção conveniente para o envio de e-mails em alguns casos, a função `mail` do PHP tem algumas limitações que devem ser consideradas:

- Ela depende do sendmail, que precisa estar instalado e configurado corretamente no servidor. Isso pode ser um problema se você estiver hospedando o aplicativo em um serviço de nuvem ou em um servidor que não tenha o sendmail instalado.
- Ela não oferece muito controle sobre o envio de e-mails. Por exemplo, não é possível definir um servidor SMTP personalizado ou adicionar anexos à mensagem.
- Ela pode ter problemas de entrega de e-mails devido a problemas de configuração do sendmail ou de problemas de DNS.
- Ela não é muito confiável em aplicativos de produção, pois pode ser facilmente falsificada e pode ser bloqueada por provedores de e-mail.

Essas limitações podem ser contornadas usando bibliotecas de envio de e-mails como o PHPMailer ou o Symfony Mailer, que são discutidas no próximo tópico.

## O que é SMTP

SMTP (Simple Mail Transfer Protocol) é um protocolo usado para enviar e-mails através da internet. Ele é responsável por transferir mensagens de e-mail de um servidor para outro, e também pode ser usado para enviar mensagens de e-mail de um cliente para um servidor.

Quando você envia um e-mail usando um cliente de e-mail como o Microsoft Outlook ou o Gmail, o cliente se comunica com um servidor SMTP para enviar a mensagem. Esse servidor é responsável por encaminhar a mensagem para o servidor de e-mail do destinatário, que, por sua vez, entrega a mensagem ao cliente de e-mail do destinatário.

## Pacotes de envio de e-mails

Se você precisa de mais flexibilidade do que a função `mail` do PHP pode oferecer, existem algumas bibliotecas que podem ser usadas para enviar e-mails com PHP. Dois exemplos populares são o PHPMailer e o Symfony Mailer.

O PHPMailer é uma das bibliotecas de envio de e-mail mais famosas do ecossistema PHP. Esse componente de código aberto que oferece uma interface de alto nível para o envio de e-mails usando PHP. Ele suporta vários métodos de envio, incluindo SMTP, e permite que você faça coisas como adicionar anexos e usar templates de e-mail.

Um exemplo de código que envia um e-mail usando `PHPMailer` seria o seguinte:

```php
<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(exceptions: true);

try {
    $mail->isSMTP();
    
    // Configurações do servidor
    $mail->Host = 'smtp.example.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'usuario@example.com';
    $mail->Password = 'senha-secreta';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    
    // Remetente e Destinatários
    $mail->setFrom('remetente@example.com', 'Nome do Remetente');
    $mail->addAddress('destinatario@example.net', 'Primeiro Destinatário');
    $mail->addAddress('destinatario2@example.com');
    $mail->addReplyTo('responder@example.com', 'Nome de para quem responder');
    $mail->addCC('cc@example.com');
    $mail->addBCC('bcc@example.com');

    // Anexos
    $mail->addAttachment('/var/tmp/arquivo.tar.gz');
    $mail->addAttachment('/tmp/imagem.jpg', 'novo-nome.jpg');

    // Conteúdo
    $mail->isHTML(true);
    $mail->Subject = 'Assunto aqui';
    $mail->Body = 'Esse é o corpo da mensagem em HTML <b>em negrito!</b>';
    $mail->AltBody = 'Esse é o corpo da mensagem em "texto puro" para clientes que não suportam HTML';

    $mail->send();
} catch (Exception $exception) {
    echo "Erro ao enviar e-mail: {$mail->ErrorInfo}";
}
```

## Conclusão:

Enviar e-mails com PHP é uma tarefa relativamente simples graças à função `mail` nativa da linguagem. No entanto, essa função tem algumas limitações e pode não ser a opção mais adequada para todos os casos de uso. Se você precisar de mais flexibilidade, pode usar bibliotecas como o PHPMailer ou o Symfony Mailer, que oferecem recursos avançados para o envio de e-mails.

Espero que este post tenha sido útil para você entender as opções disponíveis para enviar e-mails com PHP e escolher a opção mais adequada para o seu projeto.
