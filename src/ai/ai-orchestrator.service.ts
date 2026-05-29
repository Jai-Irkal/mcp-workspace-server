import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { McpService } from 'src/mcp/mcp.service';

const MAX_ITERATIONS = 5;

@Injectable()
export class AIOrchestratorService {
    constructor(
        private readonly geminiService: GeminiService,
        private readonly mcpService: McpService,
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

    async chat(prompt: string) {
        return this.runAgentLoop(
            prompt,
        );
    }

    private async runAgentLoop(
        prompt: string,
    ) {
        const ai =
            this.geminiService.getClient();

        const toolDefinitions =
            this.buildToolDefinitions();

        const conversation: any[] = [
            {
                role: 'user',

                parts: [
                    {
                        text: prompt,
                    },
                ],
            },
        ];

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