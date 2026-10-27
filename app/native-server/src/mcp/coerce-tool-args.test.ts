import { describe, expect, it } from '@jest/globals';
import { coerceArgsBySchema, coerceToolArguments } from './coerce-tool-args';

describe('coerceArgsBySchema', () => {
  const schema = {
    type: 'object' as const,
    properties: {
      tabId: { type: 'number' },
      windowId: { type: 'number' },
      refresh: { type: 'boolean' },
      tabIds: { type: 'array', items: { type: 'number' } },
      depth: { type: 'integer' },
    },
  };

  it('coerces numeric strings to numbers', () => {
    const out = coerceArgsBySchema(
      { tabId: '782337836', windowId: '12', refresh: 'true', tabIds: ['1', '2'] },
      schema,
    );
    expect(out).toEqual({
      tabId: 782337836,
      windowId: 12,
      refresh: true,
      tabIds: [1, 2],
    });
  });

  it('rejects non-numeric strings for numbers', () => {
    expect(() => coerceArgsBySchema({ tabId: 'not-a-number' }, schema)).toThrow(/tabId/);
  });

  it('leaves already-correct types alone', () => {
    const out = coerceArgsBySchema({ tabId: 42, refresh: false }, schema);
    expect(out).toEqual({ tabId: 42, refresh: false });
  });

  it('coerces integer strings', () => {
    expect(coerceArgsBySchema({ depth: '3' }, schema)).toEqual({ depth: 3 });
  });
});

describe('coerceToolArguments', () => {
  const schemas = [
    {
      name: 'chrome_navigate',
      inputSchema: {
        type: 'object' as const,
        properties: { tabId: { type: 'number' }, refresh: { type: 'boolean' } },
      },
    },
  ];

  it('finds schema by tool name', () => {
    const out = coerceToolArguments('chrome_navigate', { tabId: '99', refresh: 'false' }, schemas);
    expect(out).toEqual({ tabId: 99, refresh: false });
  });

  it('passes through unknown tools', () => {
    const out = coerceToolArguments('unknown_tool', { tabId: '99' }, schemas);
    expect(out).toEqual({ tabId: '99' });
  });
});
