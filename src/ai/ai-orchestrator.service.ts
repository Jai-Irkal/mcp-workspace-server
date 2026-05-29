import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { McpService } from 'src/mcp/mcp.service';

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
        const ai = this.geminiService.getClient();

        const toolDefinitions =
            this.buildToolDefinitions();

        const response =
            await ai.models.generateContent({
                model: 'gemini-2.5-flash',

                contents: prompt,

                config: {
                    tools: [
                        {
                            functionDeclarations:
                                toolDefinitions,
                        },
                    ],
                },
            });

        const parts =
            this.extractFunctionCalls(
                response,
            );

        for (const part of parts) {
            if (part.functionCall) {
                const toolResult =
                    await this.executeToolCall(
                        part.functionCall,
                    );

                const finalResponse =
                    await this.generateFinalResponse(
                        prompt,
                        part.functionCall.name,
                        toolResult,
                    );

                return {
                    type: 'AI_RESPONSE',

                    tool: part.functionCall.name,

                    args: part.functionCall.args,

                    result: toolResult,

                    response:
                        finalResponse.text,
                };
            }
        }

        return {
            type: 'TEXT_RESPONSE',

            response:
                response.text ||
                'No response generated',
        };
    }
}