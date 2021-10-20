import { Request, Response } from 'express';
import { CreateMessageService } from '../services/CreateMessageService';

interface MessageRequest {
  message: string
}

class CreateMessageController {
  async handle(request: Request, response: Response) {
    const { message } = request.body as MessageRequest;
    const { user_id } = request;

    const service = new CreateMessageService();

    try {
      const result = await service.execute(message, user_id);
      return response.json(result);
    } catch (error) {
      return response.status(400).json({
        message: 'Não foi possível criar a mensagem',
        error: error.message
      });
    }
  }
}

export { CreateMessageController };

