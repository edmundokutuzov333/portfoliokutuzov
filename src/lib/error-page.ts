export function renderErrorPage(message = "The application failed to render safely.") {
  return `<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Preview recovery</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#01040a;color:#f5f8ff;font:14px Inter,system-ui,sans-serif;padding:24px;text-align:center}
      main{max-width:560px}.mono{font:10px ui-monospace,Menlo,monospace;letter-spacing:.18em;color:#1d9bff;text-transform:uppercase}
      h1{font-size:32px;line-height:1.05;margin:14px 0 10px}p{color:#aab6c8;line-height:1.55;margin:0 0 22px}
      a,button{display:inline-flex;border-radius:999px;padding:12px 18px;font-weight:700;text-decoration:none;cursor:pointer}
      button{border:0;background:#1d9bff;color:#01040a}a{border:1px solid rgba(255,255,255,.16);color:#f5f8ff;margin-left:8px}
    </style>
  </head>
  <body>
    <main>
      <div class="mono">/// recovery</div>
      <h1>The interface recovered.</h1>
      <p>${escapeHtml(message)} A fallback screen was shown instead of a blank page.</p>
      <button onclick="location.reload()">Reload preview</button><a href="/">Go home</a>
    </main>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]!,
  );
}
