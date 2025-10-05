import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#1e40af" />
        <meta name="description" content="Professional NFC Digital Profile Management System Powered By BurjCode Technologies" />
        {/* Use empty favicon to override Next.js default */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}