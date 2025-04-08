import { MCPClient } from "../src/client.ts";

async function main() {
    // Create a new client instance
    const client = new MCPClient();

    try {
        // Example 1: Make a JSON-RPC request
        console.log("Making MCP request...");
        const response = await client.mcpRequest("example_method", {
            param1: "value1",
            param2: 123,
        });
        console.log("MCP Response:", response);

        // Example 2: Set session ID and send a message
        client.setSessionId("example-session-id");
        console.log("Sending message...");
        const messageResponse = await client.sendMessage("Hello, MCP server!");
        console.log("Message Response:", messageResponse);

        // Example 3: Connect to SSE
        console.log("Connecting to SSE...");
        const eventSource = await client.connectSSE((event) => {
            console.log("Received SSE event:", event.data);
        });

        // Keep the program running for a while to receive SSE events
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Close the SSE connection
        eventSource.close();
    } catch (error) {
        console.error("Error:", error);
    }
}

Deno.test("test", async () => {
    await main();
});

