import OpenAI from 'openai';
import { AppConfig, AppConfigKey } from './app-config';
import { singleton, inject } from 'tsyringe';

@singleton()
export class ThirdPartyApps {
  private openAI: OpenAI | null = null;
  private initializing: Promise<OpenAI> | null = null; // Promise to handle concurrent initializations

  constructor(@inject(AppConfig) private appConfig: AppConfig) {}

  public async getOpenAI(): Promise<OpenAI> {
    if (!this.openAI) {
      if (!this.initializing) {
        // Initialize only if not already initializing
        this.initializing = this.initializeOpenAI();
      }
      this.openAI = await this.initializing;
      this.initializing = null; // Reset initializing promise after completion
    }
    return this.openAI;
  }

  private async initializeOpenAI(): Promise<OpenAI> {
    try {
      const apiKey = await this.appConfig.getValue(
        AppConfigKey.OPEN_AI_API_KEY,
      );
      return new OpenAI({ apiKey });
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      throw new Error('Initialization of OpenAI client failed.');
    }
  }
}
