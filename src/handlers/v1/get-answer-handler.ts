import { GetAnswerDao } from '../../daos/get-answer-dao';
import { inject, singleton } from 'tsyringe';

@singleton()
export class GetAnswerHandler {
  private readonly getAnswerDao: GetAnswerDao;

  constructor(@inject(GetAnswerDao) deliveriesDao: GetAnswerDao) {
    this.getAnswerDao = deliveriesDao;
  }

  public async getAnswer(question: string): Promise<string | null> {
    return await this.getAnswerDao.getAnswer(question);
  }
}
