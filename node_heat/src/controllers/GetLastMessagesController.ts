import { Request, Response } from 'express';
import { GetLastMessagesService } from '../services/GetLastMessagesService';

class GetLastMessagesController {
  async handle(request: Request, response: Response) {
    const { quantidade } = request.query;

    console.log(request);
    console.log(quantidade);

    const service = new GetLastMessagesService();

    try {
      const result = await service.execute(Number(quantidade));
      return response.json(result);
    } catch (error) {
      return response.status(400).json({
        message: 'não foi possível obter as mensagens',
        errorCode: error.message
      });
    }
  }
}

export { GetLastMessagesController };

