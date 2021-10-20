
import prismaClient from './../prisma/index';
class GetLastMessagesService {
  async execute(numberMessages: number) {
    const messages = await prismaClient.message.findMany({
      take: numberMessages,
      orderBy: {
        created_at: "desc"
      },
      include: {
        user: true
      }
    });
    return messages;
  }
}

export { GetLastMessagesService };

