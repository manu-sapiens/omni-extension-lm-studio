//@ts-check
import { createLlmQueryComponent, extractPayload } from 'omnilib-llms/llmComponent.js';
import { Llm_LmStudio, MODEL_PROVIDER } from './llm_LmStudio.js'

const llm = new Llm_LmStudio();
const links = {}; // TBD: provide proper links
const LlmQueryComponent_LmStudio =  createLlmQueryComponent(MODEL_PROVIDER, links, runProviderPayload );

async function runProviderPayload(payload, ctx) 
{
    const { instruction, prompt, temperature, model_name, args } = extractPayload(payload, MODEL_PROVIDER);
    const response = await llm.query(ctx, prompt, instruction, model_name, temperature, args);
    return response;
}

export { LlmQueryComponent_LmStudio, extractPayload };
