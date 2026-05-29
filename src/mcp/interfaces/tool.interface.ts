import { ZodSchema } from "zod";

// Each tool must have name, description, input schema, and an execute function that takes input and returns output
export interface MCPTool {
  name: string;
  description: string;

  schema: ZodSchema;

  jsonSchema: any;

  execute(input: any): Promise<any>;
}