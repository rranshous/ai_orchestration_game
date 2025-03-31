import ollama from 'ollama/browser';

/**
 * A wrapper around the Ollama API to provide consistent error handling
 * and logging throughout the application.
 */
class OllamaService {
  /**
   * Generate a text response using Ollama API
   */
  async generate(model: string, prompt: string): Promise<string> {
    try {
      console.log(`Generating response with model: ${model}`);
      const response = await ollama.generate({
        model,
        prompt,
      });
      return response.response;
    } catch (error) {
      console.error('Error generating response from Ollama:', error);
      throw error;
    }
  }

  /**
   * Generate a chat response using Ollama API
   */
  async chat(model: string, messages: Array<{ role: string, content: string }>): Promise<string> {
    try {
      console.log(`Chatting with model: ${model}`);
      const response = await ollama.chat({
        model,
        messages
      });
      return response.message.content;
    } catch (error) {
      console.error('Error chatting with Ollama:', error);
      throw error;
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await ollama.list();
      return response.models.map((model: any) => model.name);
    } catch (error) {
      console.error('Error listing models from Ollama:', error);
      return [];
    }
  }

  /**
   * Check if Ollama API is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.listModels();
      return true;
    } catch (error) {
      console.warn('Ollama API is not available:', error);
      return false;
    }
  }
}

export default new OllamaService();
