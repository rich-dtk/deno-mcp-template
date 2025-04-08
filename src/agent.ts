import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { MCP_SERVER_NAME, VERSION } from "./constants.ts";

export class Agent {
    private server: Server;

    constructor() {
        this.server = new Server({
            name: MCP_SERVER_NAME,
            version: VERSION,
        }, {
            capabilities: {
                tools: {},
            },
        });

        this.setupTools();
    }

    private setupTools() {
        // Register available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: "greet",
                        description: "Send a greeting message",
                        inputSchema: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string",
                                    description: "The name of the person to greet"
                                }
                            },
                            required: ["name"]
                        }
                    }
                ]
            };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            if (!args) {
                throw new Error(`No arguments provided for tool: ${name}`);
            }

            switch (name) {
                case "greet":
                    return {
                        content: [{
                            type: "text",
                            text: `Hello, ${args["name"]}! How can I help you today?`
                        }]
                    };
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        });
    }

    public getServer(): Server {
        return this.server;
    }
} 