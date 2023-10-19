//@ts-check
import { runBlock , Llm, generateModelId, getModelsDirJson, DEFAULT_UNKNOWN_CONTEXT_SIZE, validateDirectoryExists , Tokenizer_Openai } from '../../../src/utils/omni-utils.js';

export const MODEL_TYPE = "lm-studio"
export const PROVIDER_NAME = "LM Studio"
export const MODEL_PROVIDER = 'lm-studio';

const BLOCK_LM_STUDIO_SIMPLE_CHATGPT = "lm-studio.simpleGenerateTextViaLmStudio";
const ICON_LM_STUDIO = '🖥';
const DEFAULT_MODEL_NAME_LM_STUDIO = 'loaded_model'

export class Llm_LmStudio extends Llm
{
    constructor()
    {
        const tokenizer_Openai = new Tokenizer_Openai()
        // TBD: use Llama tokenizer

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
    
    async query(ctx, prompt, instruction, model_name, temperature=0, args={})
    {
        // Note: model_name is not used in lm-studio as the model is selected in LM STUDIO UI
        if (!args) args = {};

        args.user = ctx.userId;
        if ("prompt" in args == false ) args.prompt = prompt;
        if ("instruction" in args == false) args.instruction = instruction;
        if ("temperature" in args == false) args.temperature = temperature;
        if ("seed" in args == false) args.seed = -1; // TBD: Check the API

        const response = await runBlock(ctx, BLOCK_LM_STUDIO_SIMPLE_CHATGPT, args);
        if (!response) throw new Error(`No response returned from ${MODEL_PROVIDER}`);
        if (response?.error) 
        {
            const error = response.error;
            const message = error.message;
            if (message)
            {
                const message_json = JSON.parse(message);
                const code = message_json?.error?.code;
                if (code)
                {
                    if (code == "ECONNREFUSED") throw new Error(`Error code = ${code}\n[ ${MODEL_PROVIDER}] Server is NOT running.\nPlease start the server and try again. (1) Run [LM Studio], (2) Click [<->], (3) Select a Model, (4) Press [Start Server]`);
                }
                throw new Error(`ERROR! code: ${code}, response: ${JSON.stringify(response)}`);
            }

            throw new Error(`ERROR! response: ${JSON.stringify(response)}`);
        }

        const choices = response?.choices;
        if (!choices) throw new Error(`No choices returned from ${MODEL_PROVIDER}`);
        if (choices.length == 0) throw new Error(`Empty choices returned from  ${MODEL_PROVIDER}`);

        const message = choices[0].message;
        if (!message) throw new Error (`No message returned from  ${MODEL_PROVIDER}. response = ${JSON.stringify(response)}`);

        const answer_text = message?.content;
        if (!answer_text) throw new Error (`No content returned from  ${MODEL_PROVIDER}. response = ${JSON.stringify(response)}`);
        
        args.answer_text = answer_text;
        const return_value = {
            answer_text: answer_text,
            answer_json: args,
        };
        return return_value;
    
    }

    getProvider()
    {
        return MODEL_PROVIDER;
    }

    getModelType()
    {
        return MODEL_TYPE;
    }

    async getModelChoices(choices, llm_model_types, llm_context_sizes)
    {
        const models_dir_json = await getModelsDirJson()
        if (!models_dir_json) return;
    
        const provider_model_dir = models_dir_json[MODEL_PROVIDER];
        if (!provider_model_dir) return;
    
        const dir_exists = await validateDirectoryExists(provider_model_dir)
        if (!dir_exists) return;
    
        choices.push({ value: generateModelId(DEFAULT_MODEL_NAME_LM_STUDIO, MODEL_PROVIDER), title: ICON_LM_STUDIO+ 'model currently loaded in (LM-Studio)', description: "Use the model currently loaded in LM-Studio if that model's server is running." });
        llm_model_types[DEFAULT_MODEL_NAME_LM_STUDIO] = MODEL_TYPE
        llm_context_sizes[DEFAULT_MODEL_NAME_LM_STUDIO] = DEFAULT_UNKNOWN_CONTEXT_SIZE
    
        return;
    }
    
}