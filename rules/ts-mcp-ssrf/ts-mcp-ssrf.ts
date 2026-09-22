import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";

const server = new McpServer({ name: "test-server", version: "1.0.0" });

server.setRequestHandler("resources/read", async (REQ) => {
  const url = REQ.params.arguments.url;
  // ruleid: ts-mcp-ssrf
  await fetch(url); // nosec
  return {};
});

server.tool("fetch-url", { url: z.string() }, async ({ url }) => {
  // ruleid: ts-mcp-ssrf
  await axios.get(url); // nosec
  return { content: [{ type: "text" as const, text: "done" }] };
});

server.registerTool(
  "proxy-v2",
  { description: "proxy", inputSchema: z.object({ url: z.string() }) },
  async ({ url }) => {
    // ruleid: ts-mcp-ssrf
    await fetch(url); // nosec
    return { content: [{ type: "text" as const, text: "done" }] };
  }
);

server.tool("patch-url", { url: z.string() }, async ({ url }) => {
  // ruleid: ts-mcp-ssrf
  await axios.patch(url); // nosec
  return { content: [{ type: "text" as const, text: "done" }] };
});

server.tool("safe-fetch", { url: z.string() }, async ({ url }) => {
  // ruleid: ts-mcp-ssrf
  await fetch(url); // nosec
  return { content: [{ type: "text" as const, text: "done" }] };
});

server.tool("hardcoded-fetch", {}, async () => {
  // ok: ts-mcp-ssrf
  await fetch("https://example.com/api");
  return { content: [{ type: "text" as const, text: "done" }] };
});
