import { invoke } from "@tauri-apps/api";

async function readEnvVariable(variableName: string): Promise<any> {

    try {
      const result = await invoke('get_environment_variable', { name: variableName });

    return result
    } catch (error: any) {
      throw error.message;
    }

}

export default readEnvVariable;