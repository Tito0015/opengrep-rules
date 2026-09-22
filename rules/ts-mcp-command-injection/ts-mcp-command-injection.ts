import { exec, execSync, execFile } from "child_process";
import * as cp from "child_process";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "test-server", version: "1.0.0" });

server.setRequestHandler("tools/call", async (REQ) => {
  const cmd = REQ.params.arguments.command;
  // ruleid: ts-mcp-command-injection
  exec(cmd); // nosec
  return {};
});

server.tool("run-command", { command: z.string() }, async (args) => {
  // ruleid: ts-mcp-command-injection
  exec(args.command, () => {}); // nosec
  return { content: [{ type: "text" as const, text: "done" }] };
});

server.tool("run-sync", { command: z.string() }, async ({ command }) => {
  // ruleid: ts-mcp-command-injection
  execSync(command); // nosec
  return { content: [{ type: "text" as const, text: "done" }] };
});

server.registerTool(
  "run-v2",
  { description: "run", inputSchema: z.object({ command: z.string() }) },
  async ({ command }) => {
    // ruleid: ts-mcp-command-injection
    cp.execSync(command); // nosec
    return { content: [{ type: "text" as const, text: "done" }] };
  }
);

server.tool("eval-concat", { command: z.string() }, async ({ command }) => {
  // ruleid: ts-mcp-command-injection
  eval("prefix" + command + "suffix"); // nosec
  return { content: [{ type: "text" as const, text: "done" }] };
});

server.tool("safe-zod", { command: z.string() }, async ({ command }) => {
  const safe = z.string().parse(command);
  // ruleid: ts-mcp-command-injection
  exec(safe); // nosec
  return { content: [{ type: "text" as const, text: "done" }] };
});

server.tool("list-files", {}, async () => {
  // ok: ts-mcp-command-injection
  exec("ls -la /tmp");
  return { content: [{ type: "text" as const, text: "done" }] };
});

server.tool("safe-execfile", { filename: z.string() }, async ({ filename }) => {
  // ok: ts-mcp-command-injection
  execFile("cat", [filename]);
  return { content: [{ type: "text" as const, text: "done" }] };
});

function unrelated(cmd: string) {
  // ok: ts-mcp-command-injection
  exec(cmd);
}
