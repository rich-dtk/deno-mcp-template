/**
 * MCP Client for interacting with the MCP server
 */
export class MCPClient {
    private baseUrl: string;
    private sessionId: string | null = null;

    constructor(baseUrl: string = "http://localhost:3001") {
        this.baseUrl = baseUrl;
    }

    /**
     * Set the session ID for subsequent requests
     */
    setSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }

    /**
     * Make a JSON-RPC request to the MCP endpoint
     */
    async mcpRequest(method: string, params: Record<string, unknown> = {}) {
        const response = await fetch(`${this.baseUrl}/mcp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...(this.sessionId ? { "X-Session-ID": this.sessionId } : {}),
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method,
                params,
                id: Date.now(),
            }),
        });

        if (!response.ok) {
            throw new Error(`MCP request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();

    }

    /**
     * Send a message to the message endpoint
     */
    async sendMessage(message: string) {
        if (!this.sessionId) {
            throw new Error("Session ID must be set before sending messages");
        }

        const response = await fetch(`${this.baseUrl}/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Session-ID": this.sessionId,
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`Message send failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Connect to the SSE endpoint and listen for events
     */
    async connectSSE(callback: (event: MessageEvent) => void) {
        // Create the SSE URL with session ID as a query parameter if available
        const url = new URL(`${this.baseUrl}/sse`);
        if (this.sessionId) {
            url.searchParams.append("sessionId", this.sessionId);
        }

        const eventSource = new EventSource(url.toString());

        eventSource.onmessage = callback;
        eventSource.onerror = (error) => {
            console.error("SSE Error:", error);
            eventSource.close();
        };

        return eventSource;
    }
} 