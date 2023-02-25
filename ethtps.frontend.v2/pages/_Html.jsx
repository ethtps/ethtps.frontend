// Most basic html component – in real app you will need something more complex
export function Html({ children, styles }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* We will inject extracted styles here */}
        {styles}
      </head>

      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
      </body>
    </html>
  );
}
