#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { initializeDatabase } from "./db/client.js";
import { tools, handleToolCall } from "./tools/index.js";
const server = new Server({
    name: "quantmaster-mcp-server",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        const result = await handleToolCall(name, args || {});
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return {
            content: [{ type: "text", text: `Error: ${message}` }],
            isError: true,
        };
    }
});
async function main() {
    try {
        await initializeDatabase();
        console.error("Dr. QuantMaster MCP Server initialized");
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("Dr. QuantMaster MCP Server running on stdio");
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map