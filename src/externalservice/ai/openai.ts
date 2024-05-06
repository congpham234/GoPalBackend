import { singleton } from 'tsyringe';
import { ThirdPartyApps } from '../../third-party-apps';

@singleton()
export class OpenAiFacade {
  public answer = async (
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> => {
    try {
      const completion =
        await ThirdPartyApps.getInstance().openAI.chat.completions.create({
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
  };
}
