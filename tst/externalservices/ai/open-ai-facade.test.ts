import { OpenAiFacade } from '../../../src/externalservice/ai/open-ai-facade';
import { ThirdPartyApps } from '../../../src/third-party-apps';
import { container } from 'tsyringe';
import { mock, when, instance } from 'ts-mockito';
import { OpenAI } from 'openai';

describe('OpenAiFacade', () => {
  // let openAiFacade: OpenAiFacade;
  const mockedThirdPartyApps = mock(ThirdPartyApps);
  const mockedOpenAI = mock(OpenAI);
  // const mockedChat = jest.fn();
  // const mockedCompletions = jest.fn();
  const mockedPromiseResolve = jest.fn();

  beforeEach(() => {
    // Reset the container
    container.reset();
    Promise.resolve = mockedPromiseResolve;

    // Return the mocked instance when ThirdPartyApps.getInstance() is called
    ThirdPartyApps.getInstance = jest
      .fn()
      .mockReturnValue(instance(mockedThirdPartyApps));
    when(mockedThirdPartyApps.openAIInstance).thenReturn(mockedOpenAI);
    // when(mockedOpenAI.chat).thenReturn(instance(mockedChat));
    // when(mockedChat.completions).thenReturn(instance(mockedCompletions));

    // Register OpenAiFacade as a singleton in the container
    container.registerSingleton(OpenAiFacade);

    // Retrieve the instance
    // openAiFacade = container.resolve(OpenAiFacade);
  });

  it('should return the correct answer from OpenAI', async () => {
    // const resolvedResponsePromise = mock(Promise);
    // mockedPromiseResolve.mockReturnValue({
    //   choices: [
    //     { message: { content: "Nice to meet you, John." } }
    //   ]
    // });
    // const systemPrompt = "Hello, what's your name?";
    // const userPrompt = "I am John.";
    // when(mockedCompletions.create(deepEqual({
    //   messages: [
    //     { role: 'system', content: systemPrompt },
    //     { role: 'user', content: userPrompt },
    //   ],
    //   model: 'gpt-3.5-turbo-0125',
    // }))).thenReturn(resolvedResponsePromise);
    // const result = await openAiFacade.answer(systemPrompt, userPrompt);
    // expect(result).toEqual("Nice to meet you, John.");
    // verify(mockedOpenAI.chat.completions.create(deepEqual({
    //   messages: [
    //     { role: 'system', content: systemPrompt },
    //     { role: 'user', content: userPrompt },
    //   ],
    //   model: 'gpt-3.5-turbo-0125',
    // }))).once();
  });
});
