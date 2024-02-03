async function readEnvVariable(variableName: string): Promise<any> {
    try {
      return import.meta.env[`APP_${variableName}`];
    } catch (error: any) {
      console.log('Error ENV', error);
      throw error;
    }

}

export default readEnvVariable;