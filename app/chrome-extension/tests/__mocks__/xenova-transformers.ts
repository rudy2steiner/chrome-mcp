export type Tensor = {
  data: Int32Array | BigInt64Array | Float32Array;
  dims: number[];
};

export type PreTrainedTokenizer = {
  (
    text: string | string[],
    options?: Record<string, unknown>,
  ): Promise<{
    input_ids: Tensor;
    attention_mask: Tensor;
    token_type_ids?: Tensor;
  }>;
};

function makeTensor(text: string | string[]): Tensor {
  const items = Array.isArray(text) ? text : [text];
  const width = Math.max(1, ...items.map((item) => item.split(/\s+/).filter(Boolean).length));
  const data = new Int32Array(items.length * width);

  for (let row = 0; row < items.length; row++) {
    for (let column = 0; column < width; column++) {
      data[row * width + column] = column + 1;
    }
  }

  return { data, dims: [items.length, width] };
}

export const env = {
  allowRemoteModels: true,
  allowLocalModels: false,
  backends: {
    onnx: {
      wasm: {
        numThreads: 1,
      },
    },
  },
};

export const AutoTokenizer = {
  async from_pretrained(): Promise<PreTrainedTokenizer> {
    return async (text: string | string[], options: Record<string, unknown> = {}) => {
      const inputIds = makeTensor(text);
      const attentionMask = {
        data: new Int32Array(inputIds.data.length).fill(1),
        dims: inputIds.dims,
      };

      return {
        input_ids: inputIds,
        attention_mask: attentionMask,
        ...(options.return_token_type_ids === false
          ? {}
          : {
              token_type_ids: {
                data: new Int32Array(inputIds.data.length),
                dims: inputIds.dims,
              },
            }),
      };
    };
  },
};
