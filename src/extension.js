//@ts-check
// extension.js
import { LlmManagerComponent_LmStudio } from "./component_LlmManager_LmStudio"; 
import { LlmQueryComponent_LmStudio } from "./component_LlmQuery_LmStudio";


async function CreateComponents() 
{
  const components = [LlmManagerComponent_LmStudio, LlmQueryComponent_LmStudio ];

  return {
    blocks: components,
    patches: []
  }
}

export default {createComponents: CreateComponents}