import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { McpService } from 'src/mcp/mcp.service';
import { MemoryService } from 'src/mcp/memory/memory.service';
import { SemanticMemoryService } from 'src/mcp/semantic-memory/semantic-memory.service';

const MAX_ITERATIONS = 5;

@Injectable()
export class AIOrchestratorService {
    constructor(
        private readonly geminiService: GeminiService,
        private readonly mcpService: McpService,
        private readonly memoryService: MemoryService,
        private readonly semanticMemoryService: SemanticMemoryService,
    ) { }

    private buildToolDefinitions() {
        const tools = this.mcpService.getTools();

        return tools.map((tool) => ({
            name: tool.name,

            description: tool.description,

            parameters: tool.jsonSchema,
        }));
    }

    private async generateFinalResponse(
        prompt: string,
        toolName: string,
        toolResult: any,
    ) {
        const ai = this.geminiService.getClient();

        return ai.models.generateContent({
            model: 'gemini-2.5-flash',

            contents: `
      User request:
      ${prompt}

      Tool executed:
      ${toolName}

      Tool result:
      ${JSON.stringify(toolResult)}
    `,
        });
    }

    private extractFunctionCalls(
        response: any,
    ) {
        const candidate =
            response.candidates?.[0];

        return (
            candidate?.content?.parts || []
        );
    }

    private async executeToolCall(
        functionCall: any,
    ) {
        const toolName = functionCall.name;

        const toolArgs = functionCall.args;

        return this.mcpService.executeTool(
            toolName,
            toolArgs,
        );
    }

    async chat(sessionId: string, prompt: string) {
        return this.runAgentLoop(
            sessionId,
            prompt,
        );
    }

    private async runAgentLoop(
        sessionId: string,
        prompt: string,
    ) {
        const ai =
            this.geminiService.getClient();

        const toolDefinitions =
            this.buildToolDefinitions();

        const relevantMemories =
            await this.semanticMemoryService.searchRelevantMemories(
                sessionId,
                prompt,
            );

        const conversation: any[] = [
            {
                role: 'user',

                parts: [
                    {
                        text: `
You are an enterprise MCP AI assistant.

You can:
- manage tasks
- use tools
- maintain conversational memory
- reason step-by-step

Always use tools when needed.
`,
                    },
                ],
            },
        ];

        conversation.push({
            role: 'user',

            parts: [
                {
                    text: `
Relevant long-term memories:

${relevantMemories
                            .map((m) => `- ${m.content}`)
                            .join('\n')}
`,
                },
            ],
        });

        const history =
            await this.memoryService.getRecentMessages(
                sessionId,
            );

        if (history.length > 30) {
            console.log(
                'Conversation becoming large',
            );
        }

        conversation.push(...history.map(
            (message) => ({
                role: message.role,

                parts: [
                    {
                        text: message.content,
                    },
                ],
            }),
        ));

        await this.memoryService.addMessage(
            sessionId,
            'user',
            prompt,
        );

        await this.semanticMemoryService.storeMemory(
            sessionId,
            prompt,
        );

        for (
            let iteration = 0;
            iteration < MAX_ITERATIONS;
            iteration++
        ) {
            const response =
                await ai.models.generateContent({
                    model: 'gemini-2.5-flash',

                    contents: conversation,

                    config: {
                        tools: [
                            {
                                functionDeclarations:
                                    toolDefinitions,
                            },
                        ],
                    },
                });

            const candidate =
                response.candidates?.[0];

            const parts =
                candidate?.content?.parts ||
                [];

            conversation.push({
                role: 'model',
                parts,
            });

            let toolExecuted = false;

            for (const part of parts) {
                if (part.functionCall) {
                    toolExecuted = true;

                    const toolResult =
                        await this.executeToolCall(
                            part.functionCall,
                        );

                    conversation.push({
                        role: 'user',

                        parts: [
                            {
                                functionResponse: {
                                    name: part.functionCall.name,

                                    response: toolResult,
                                },
                            },
                        ],
                    });
                }
            }

            if (!toolExecuted) {
                await this.memoryService.addMessage(
                    sessionId,
                    'model',
                    response.text || '',
                );
                return {
                    type: 'AGENT_RESPONSE',

                    iterations:
                        iteration + 1,

                    response:
                        response.text,
                };
            }
        }

        return {
            type: 'MAX_ITERATIONS_REACHED',

            message:
                'Agent stopped after reaching max iterations',
        };
    }
}