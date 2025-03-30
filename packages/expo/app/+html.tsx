// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no'
        />
        <title>Eki</title>
        <meta property='og:title' content='Eki' />
        <meta property='og:description' content='好きを言葉に' />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body {
                min-height: 100%;
              }
              #root {
                display: flex;
                flex: 1;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
