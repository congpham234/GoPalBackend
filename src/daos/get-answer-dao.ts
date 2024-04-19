import { singleton } from 'tsyringe';
import { openai } from '../middlewares/open-ai';

@singleton()
export class GetAnswerDao {
  public async getAnswer(question: string): Promise<string | null> {
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: question }],
        model: 'gpt-3.5-turbo',
      });

      console.log(completion);

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow the error to handle it at a higher level
    }
  }
}
