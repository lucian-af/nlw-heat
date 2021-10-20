import { Request, Response } from 'express';
import { ProfileUserService } from '../services/ProfileUserService';

class ProfileUserController {
  async handle(request: Request, response: Response) {
    const { user_id } = request;

    const service = new ProfileUserService();

    try {
      const result = await service.execute(user_id);
      return response.json(result);
    } catch (error) {
      return response.status(400).json({
        message: 'não foi possível obter os dados do usuário.',
        errorCode: error.message
      });
    }
  }
}

export { ProfileUserController };

