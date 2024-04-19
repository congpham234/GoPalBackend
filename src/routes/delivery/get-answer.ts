import { Router } from 'express';
import { container } from 'tsyringe';
import { Answer, Question } from '../../../generated';
import { GetAnswerHandler } from '../../handlers/v1/get-answer-handler';

const getAnswerHandler = container.resolve(GetAnswerHandler);

const getAnswer = (router: Router): void => {
  router.post('/v1/ai', async (req, res, next) => {
    try {
      const question = req.body as Question;
      let answer = '';
      if (question.answer) {
        answer = await getAnswerHandler.getAnswer(question.answer) ?? '';
      }

      // Create an instance of the Answer model
      const response: Answer = {
        answer,
      };
      res.send(response);
    } catch (error) {
      next(error);
    }
  });
};

export default getAnswer;
