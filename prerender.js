// prerender.js
import { renderToString } from "react-dom/server";
import App from "./src/App";

export async function prerender() {
  const html = renderToString(App);
  return { html };
}
