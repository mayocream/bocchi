import Mailgun from 'mailgun.js'

const mailgun = new Mailgun(FormData)
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
})

export const confirmEmailTemplate = (token: string) => {
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Twitter メールアドレスの確認</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 20px;
            background-color: #f5f8fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .logo {
            width: 40px;
            height: 40px;
            background-color: #ffffff;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .content {
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #1DA1F2;
            color: #ffffff;
            text-decoration: none;
            border-radius: 25px;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #657786;
            padding-top: 20px;
            border-top: 1px solid #eee;
            margin-top: 20px;
        }
        a {
            color: #1DA1F2;
            text-decoration: none;
        }
        .footer a {
            margin: 0 10px;
            color: #657786;
        }
        h1 {
            font-size: 24px;
            color: #14171a;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <svg class="logo" viewBox="0 0 24 24" fill="#1DA1F2">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
            </svg>
        </div>
        <div class="content">
            <h1>メールアドレスの確認</h1>
            <p>こんにちは、</p>
            <p>Twitterアカウントのメールアドレスを確認するために、以下のボタンをクリックしてください。</p>

            <div style="text-align: center;">
                <a href="https://twitter.co.jp/email/${token}" class="button">メールアドレスを確認する</a>
            </div>

            <p>このボタンの有効期限は24時間です。</p>

            <p>もしボタンがクリックできない場合は、以下のURLをブラウザにコピー＆ペーストしてください：<br>
            <a href="#">https://twitter.co.jp/email/${token}</a></p>

            <p>このメールに心当たりがない場合は、無視していただいて構いません。</p>

            <p>よろしくお願いいたします。<br>
            Twitter.co.jp</p>
        </div>
    </div>
</body>
</html>
`
}

export async function sendMail(to: string, subject: string, html: string) {
  await mg.messages.create('twitter.co.jp', {
    from: 'Twitter <noreply@twitter.co.jp>',
    to,
    subject,
    html,
  })
}
