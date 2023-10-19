//@ts-check
import { async_getLlmQueryComponent, extractLlmQueryPayload } from '../../../src/utils/omni-utils.js';
import { Llm_LmStudio, MODEL_PROVIDER } from './llm_LmStudio.js'

const llm = new Llm_LmStudio();
const links = {}; // TBD: provide proper links

export async function async_getLlmQueryComponent_LmStudio()
{
    const result = await async_getLlmQueryComponent(MODEL_PROVIDER, links, runProviderPayload, false );
    return result;
}

async function runProviderPayload(payload, ctx) 
{
    const { instruction, prompt, temperature, model_name, args } = extractLlmQueryPayload(payload, MODEL_PROVIDER);
    const response = await llm.query(ctx, prompt, instruction, model_name, temperature, args);
    return response;
}


