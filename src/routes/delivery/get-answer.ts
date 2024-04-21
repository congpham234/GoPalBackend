import { Router } from 'express';
import { container } from 'tsyringe';
import { Answer } from '../../../generated';
import { GeneratePromptImageHandler } from '../../handlers/v1/generate-prompt-image-handler';

const generatePromptImageHandler = container.resolve(GeneratePromptImageHandler);

const getAnswer = (router: Router): void => {
  router.post('/v1/ai', async (req, res, next) => {
    try {
      let answer = '';
      answer = await generatePromptImageHandler.generatePromptImage(req.body.answer) ?? '';
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
