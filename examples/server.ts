import { MCPServer } from "../src/server.ts";

async function main() {
    const server = new MCPServer();

    // Start the server on port 3001
    await server.start(3001);
    console.log("MCP Server started on port 3001");

    // Keep the server running
    await new Promise(() => { });
}

if (import.meta.main) {
    await main();
} 