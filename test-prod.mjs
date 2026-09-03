import server from "./.vercel/output/functions/__server.func/index.mjs";
const req = new Request("http://localhost:3000/portfolio/test");
const res = await server.fetch(req);
console.log(res.status);
console.log(await res.text());
