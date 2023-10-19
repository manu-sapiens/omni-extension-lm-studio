/**
 * Copyright (c) 2023 MERCENARIES.AI PTE. LTD.
 * All rights reserved.
 */

//@ts-check
// extension.js
import { LlmManagerComponent_LmStudio } from "./component_LlmManager_LmStudio"; 
import { async_getLlmQueryComponent_LmStudio } from "./component_LlmQuery_LmStudio";


async function CreateComponents() 
{
  const LlmQueryComponent_LmStudio = await async_getLlmQueryComponent_LmStudio();
  const components = [LlmManagerComponent_LmStudio, LlmQueryComponent_LmStudio ];

  return {
    blocks: components,
    patches: []
  }
}

export default {createComponents: CreateComponents}