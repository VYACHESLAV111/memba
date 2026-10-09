import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client(
  { name: "memba-onyx-verification", version: "1.0.0" },
  { capabilities: {} }
);

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["build/index.js"],
  cwd: "D:\\GNO\\memba\\mcp-server",
  env: {
    ...process.env,
    GNO_RPC_URL: "https://rpc.onyx.testnets.gno.land:443",
  },
});

try {
  await client.connect(transport);
  const tools = await client.listTools();
  console.log("MCP_TOOLS:", tools.tools.map((tool) => tool.name).join(", "));

  const result = await client.callTool({
    name: "memba_get_network",
    arguments: {},
  });
  console.log("NETWORK_RESULT:", JSON.stringify(result, null, 2));

  const renderResult = await client.callTool({
    name: "memba_query_render",
    arguments: {
      realm_path: "gno.land/r/gov/dao",
      path: "",
    },
  });
  console.log("PUBLIC_REALM_RESULT:", JSON.stringify(renderResult, null, 2));
  const snapshotResult = await client.callTool({
    name: "elaris_get_realm_snapshot",
    arguments: {
      realm_path: "gno.land/r/gov/dao",
      path: "",
    },
  });

  console.log(
    "ELARIS_REALM_SNAPSHOT:",
    JSON.stringify(snapshotResult, null, 2)
  );
} catch (error) {
  console.error("MCP_TEST_FAILED:", error);
  process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
}
