import { ZodSchema } from "zod";

export interface MCPTool {
  name: string;
  description: string;

  schema: ZodSchema;

  jsonSchema: any;

  execute(input: any): Promise<any>;
}