//@ts-check
import { createComponent } from '../../../src/utils/omni-utils.js';
import { MODEL_PROVIDER, PROVIDER_NAME } from './llm_LmStudio.js'

const inputs = [
    { name: 'read_me', type: 'string', customSocket: 'text', defaultValue: "1) Run LM Studio\n2) <-> : [Start Server]"},
    { name: `max_token`, type: 'number', defaultValue: -1, minimum: -1, maximum: 32768, step:1, description: "The maximum number of tokens to generate. -1: not specified"},
    { name: 'args', type: 'object', customSocket: 'object', description: 'Extra arguments provided to the LLM'},

];
const outputs = [
    { name: 'model_id', type: 'string', customSocket: 'text', description: "The ID of the selected LLM model"},
    { name: 'args', type: 'object', customSocket: 'object', description: 'Extra arguments provided to the LLM'},
]
const controls = null;
const links = {}

export const LlmManagerComponent_LmStudio = createComponent(MODEL_PROVIDER, 'llm_manager',`LLM Manager: ${PROVIDER_NAME}`, 'Text Generation',`Manage LLMs from provider: ${PROVIDER_NAME}`, `Manage LLMs from provider: ${PROVIDER_NAME}`, links, inputs, outputs, controls, parsePayload );

async function parsePayload(payload, ctx) 
{
    const args = payload.args || {};

    const max_token = payload.max_token || -1;
    if ("max_token" in args == false) args.max_token = max_token;
 
    args.stream = false; // Streaming not supported yet
   
    return  { result: { "ok": true }, model_id: `model_loaded_in_${MODEL_PROVIDER}|${MODEL_PROVIDER}`, args: args};
}