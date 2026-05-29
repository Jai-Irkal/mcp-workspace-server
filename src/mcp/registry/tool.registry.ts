import { Injectable } from '@nestjs/common';
import { MCPTool } from '../interfaces/tool.interface';

@Injectable()
export class ToolRegistry {
  private tools = new Map<string, MCPTool>();

  register(tool: MCPTool) {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string) {
    return this.tools.get(name);
  }

  listTools() {
    return Array.from(this.tools.values());
  }

  async executeTool(name: string, input: any) {
    const tool = this.tools.get(name);

    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }

    return tool.execute(input);
  }
}