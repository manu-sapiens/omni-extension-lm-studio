//@ts-check
// extension.js
import { LlmManagerLmStudioComponent } from "./component_LlmManager_LmStudio"; 
import { LlmQueryComponent_LmStudio } from "./component_LlmQuery_LmStudio";


async function CreateComponents() 
{
  const components = [LlmManagerLmStudioComponent, LlmQueryComponent_LmStudio ];

  return {
    blocks: components,
    patches: []
  }
}

export default {createComponents: CreateComponents}