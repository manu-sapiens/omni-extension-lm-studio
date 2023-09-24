
await(async()=>{let{dirname:e}=await import("path"),{fileURLToPath:i}=await import("url");if(typeof globalThis.__filename>"u"&&(globalThis.__filename=i(import.meta.url)),typeof globalThis.__dirname>"u"&&(globalThis.__dirname=e(globalThis.__filename)),typeof globalThis.require>"u"){let{default:a}=await import("module");globalThis.require=a.createRequire(import.meta.url)}})();


// component_LlmManager_LmStudio.js
import { createComponent } from "omni-utils";

// llm_LmStudio.js
import { runBlock } from "omni-utils";
import { Llm, generateModelId, getModelsDirJson, DEFAULT_UNKNOWN_CONTEXT_SIZE } from "omni-utils";
import { validateDirectoryExists } from "omni-utils";
import { Tokenizer_Openai } from "omni-utils";
var MODEL_TYPE = "lm-studio";
var PROVIDER_NAME = "LM Studio";
var MODEL_PROVIDER = "lm-studio";
var BLOCK_LM_STUDIO_SIMPLE_CHATGPT = "lm-studio.simpleGenerateTextViaLmStudio";
var ICON_LM_STUDIO = "\u{1F5A5}";
var DEFAULT_MODEL_NAME_LM_STUDIO = "loaded_model";
var Llm_LmStudio = class extends Llm {
  constructor() {
    const tokenizer_Openai = new Tokenizer_Openai();
    super(tokenizer_Openai);
  }
  // -----------------------------------------------------------------------
  /**
   * @param {any} ctx
   * @param {string} prompt
   * @param {string} instruction
   * @param {string} model_name
   * @param {number} [temperature=0]
   * @param {any} [args={}]
   * @returns {Promise<{ answer_text: string; answer_json: any; }>}
   */
  async query(ctx, prompt, instruction, model_name, temperature = 0, args = {}) {
    if (!args)
      args = {};
    args.user = ctx.userId;
    if ("prompt" in args == false)
      args.prompt = prompt;
    if ("instruction" in args == false)
      args.instruction = instruction;
    if ("temperature" in args == false)
      args.temperature = temperature;
    if ("seed" in args == false)
      args.seed = -1;
    const response = await runBlock(ctx, BLOCK_LM_STUDIO_SIMPLE_CHATGPT, args);
    if (!response)
      throw new Error(`No response returned from ${MODEL_PROVIDER}`);
    if (response?.error) {
      const error = response.error;
      const message2 = error.message;
      if (message2) {
        const message_json = JSON.parse(message2);
        const code = message_json?.error?.code;
        if (code) {
          if (code == "ECONNREFUSED")
            throw new Error(`Error code = ${code}
[ ${MODEL_PROVIDER}] Server is NOT running.
Please start the server and try again. (1) Run [LM Studio], (2) Click [<->], (3) Select a Model, (4) Press [Start Server]`);
        }
        throw new Error(`ERROR! code: ${code}, response: ${JSON.stringify(response)}`);
      }
      throw new Error(`ERROR! response: ${JSON.stringify(response)}`);
    }
    const choices = response?.choices;
    if (!choices)
      throw new Error(`No choices returned from ${MODEL_PROVIDER}`);
    if (choices.length == 0)
      throw new Error(`Empty choices returned from  ${MODEL_PROVIDER}`);
    const message = choices[0].message;
    if (!message)
      throw new Error(`No message returned from  ${MODEL_PROVIDER}. response = ${JSON.stringify(response)}`);
    const answer_text = message?.content;
    if (!answer_text)
      throw new Error(`No content returned from  ${MODEL_PROVIDER}. response = ${JSON.stringify(response)}`);
    args.answer_text = answer_text;
    const return_value = {
      answer_text,
      answer_json: args
    };
    return return_value;
  }
  getProvider() {
    return MODEL_PROVIDER;
  }
  getModelType() {
    return MODEL_TYPE;
  }
  async getModelChoices(choices, llm_model_types, llm_context_sizes) {
    const models_dir_json = await getModelsDirJson();
    if (!models_dir_json)
      return;
    const provider_model_dir = models_dir_json[MODEL_PROVIDER];
    if (!provider_model_dir)
      return;
    const dir_exists = await validateDirectoryExists(provider_model_dir);
    if (!dir_exists)
      return;
    choices.push({ value: generateModelId(DEFAULT_MODEL_NAME_LM_STUDIO, MODEL_PROVIDER), title: ICON_LM_STUDIO + "model currently loaded in (LM-Studio)", description: "Use the model currently loaded in LM-Studio if that model's server is running." });
    llm_model_types[DEFAULT_MODEL_NAME_LM_STUDIO] = MODEL_TYPE;
    llm_context_sizes[DEFAULT_MODEL_NAME_LM_STUDIO] = DEFAULT_UNKNOWN_CONTEXT_SIZE;
    return;
  }
};

// component_LlmManager_LmStudio.js
var inputs = [
  { name: "read_me", type: "string", customSocket: "text", defaultValue: "1) Run LM Studio\n2) <-> : [Start Server]" },
  { name: `max_token`, type: "number", defaultValue: -1, minimum: -1, maximum: 32768, step: 1, description: "The maximum number of tokens to generate. -1: not specified" },
  { name: "args", type: "object", customSocket: "object", description: "Extra arguments provided to the LLM" }
];
var outputs = [
  { name: "model_id", type: "string", customSocket: "text", description: "The ID of the selected LLM model" },
  { name: "args", type: "object", customSocket: "object", description: "Extra arguments provided to the LLM" }
];
var controls = null;
var links = {};
var LlmManagerComponent_LmStudio = createComponent(MODEL_PROVIDER, "llm_manager", `LLM Manager: ${PROVIDER_NAME}`, "Text Generation", `Manage LLMs from provider: ${PROVIDER_NAME}`, `Manage LLMs from provider: ${PROVIDER_NAME}`, links, inputs, outputs, controls, parsePayload);
async function parsePayload(payload, ctx) {
  const args = payload.args || {};
  const max_token = payload.max_token || -1;
  if ("max_token" in args == false)
    args.max_token = max_token;
  args.stream = false;
  return { result: { "ok": true }, model_id: `model_loaded_in_${MODEL_PROVIDER}|${MODEL_PROVIDER}`, args };
}

// component_LlmQuery_LmStudio.js
import { async_getLlmQueryComponent, extractLlmQueryPayload } from "omni-utils";
var llm = new Llm_LmStudio();
var links2 = {};
async function async_getLlmQueryComponent_LmStudio() {
  const result = await async_getLlmQueryComponent(MODEL_PROVIDER, links2, runProviderPayload, false);
  return result;
}
async function runProviderPayload(payload, ctx) {
  const { instruction, prompt, temperature, model_name, args } = extractLlmQueryPayload(payload, MODEL_PROVIDER);
  const response = await llm.query(ctx, prompt, instruction, model_name, temperature, args);
  return response;
}

// extension.js
async function CreateComponents() {
  const LlmQueryComponent_LmStudio = await async_getLlmQueryComponent_LmStudio();
  const components = [LlmManagerComponent_LmStudio, LlmQueryComponent_LmStudio];
  return {
    blocks: components,
    patches: []
  };
}
var extension_default = { createComponents: CreateComponents };
export {
  extension_default as default
};
