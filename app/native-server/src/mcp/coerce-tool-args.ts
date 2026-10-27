/**
 * Schema-driven argument coercion for MCP tool calls.
 * Absorbs clients that stringify numbers/booleans (e.g. tabId: "123").
 */

type JsonSchema = {
  type?: string | string[];
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema | JsonSchema[];
  additionalProperties?: boolean | JsonSchema;
};

function primaryType(schema: JsonSchema): string | undefined {
  if (!schema?.type) return undefined;
  return Array.isArray(schema.type) ? schema.type[0] : schema.type;
}

function coerceNumber(value: unknown, path: string): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  if (typeof value === 'boolean') return value ? 1 : 0;
  throw new Error(`Invalid ${path}: expected number, got ${JSON.stringify(value)}`);
}

function coerceBoolean(value: unknown, path: string): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === 'true' || v === '1') return true;
    if (v === 'false' || v === '0') return false;
  }
  throw new Error(`Invalid ${path}: expected boolean, got ${JSON.stringify(value)}`);
}

function coerceInteger(value: unknown, path: string): number {
  const n = coerceNumber(value, path);
  if (!Number.isInteger(n)) {
    throw new Error(`Invalid ${path}: expected integer, got ${JSON.stringify(value)}`);
  }
  return n;
}

function coerceValue(value: unknown, schema: JsonSchema | undefined, path: string): unknown {
  if (value === undefined || value === null || !schema) return value;

  const type = primaryType(schema);

  if (type === 'number') return coerceNumber(value, path);
  if (type === 'integer') return coerceInteger(value, path);
  if (type === 'boolean') return coerceBoolean(value, path);

  if (type === 'array') {
    if (!Array.isArray(value)) {
      throw new Error(`Invalid ${path}: expected array, got ${JSON.stringify(value)}`);
    }
    const itemSchema = Array.isArray(schema.items) ? schema.items[0] : schema.items;
    return value.map((item, i) => coerceValue(item, itemSchema, `${path}[${i}]`));
  }

  if (type === 'object' && value && typeof value === 'object' && !Array.isArray(value)) {
    return coerceArgsBySchema(value as Record<string, unknown>, schema, path);
  }

  return value;
}

/**
 * Coerce tool arguments in-place according to a JSON Schema object definition.
 */
export function coerceArgsBySchema(
  args: Record<string, unknown>,
  schema: JsonSchema | undefined,
  path = 'args',
): Record<string, unknown> {
  if (!args || typeof args !== 'object' || Array.isArray(args)) {
    throw new Error(`Invalid ${path}: expected object`);
  }
  if (!schema?.properties) return { ...args };

  const out: Record<string, unknown> = { ...args };
  for (const [key, propSchema] of Object.entries(schema.properties)) {
    if (!(key in out) || out[key] === undefined) continue;
    out[key] = coerceValue(out[key], propSchema, `${path}.${key}`);
  }
  return out;
}

export type ToolSchemaLike = {
  name: string;
  inputSchema?: JsonSchema;
};

/**
 * Look up a tool schema by name and coerce args. Unknown tools pass through.
 */
export function coerceToolArguments(
  toolName: string,
  args: Record<string, unknown> | undefined,
  schemas: ToolSchemaLike[],
): Record<string, unknown> {
  const input = args && typeof args === 'object' ? { ...args } : {};
  const schema = schemas.find((s) => s.name === toolName)?.inputSchema;
  if (!schema) return input;
  return coerceArgsBySchema(input, schema);
}
