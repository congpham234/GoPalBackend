import { inject, singleton } from 'tsyringe';
import { ThirdPartyApps } from '../../third-party-apps';
import { ChatCompletion } from 'openai/resources';

@singleton()
export class OpenAiFacade {
  constructor(@inject(ThirdPartyApps) private thirdPartyApps: ThirdPartyApps) {}

  public async answer(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    try {
      const openAIClient = await this.thirdPartyApps.getOpenAI();
      const completion: ChatCompletion =
        await openAIClient.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          model: 'gpt-3.5-turbo-0125',
        });

      // Make sure completion.choices is not empty before accessing its content
      if (completion.choices && completion.choices.length > 0) {
        return completion.choices[0].message.content || '';
      } else {
        throw new Error('No completion choices found.');
      }
    } catch (error) {
      console.error('Error while generating completion:', error);
      throw error;
    }
  }
}
