import axios from "axios";
import { sign } from 'jsonwebtoken';
import prismaClient from './../prisma/index';

/*
  Receber o codigo string
  Recuperar o access token do github no github
  Reuperar infos do github
  Verificar se o usuario existe no DB
    Existe? Gera um token
    Não Existe? Cria no DB e gera o token      
  Retornar o token com as infos do user logado
*/

interface IAccessTokenResponse {
  access_token: string
}

interface IUserResponse {
  avatar_url: string,
  login: string,
  id: number,
  name: string
}

class AuthenticateUserService {
  async execute(code: string) {
    const urlToken = 'https://github.com/login/oauth/access_token';
    const urlInfos = 'https://api.github.com/user';

    const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(urlToken, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    const { data: userResponse } = await axios.get<IUserResponse>(urlInfos, {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`
      }
    })

    const { login, id, avatar_url, name } = userResponse;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          avatar_url,
          login,
          name
        }
      });
    }

    const token = sign({
      user: {
        name: user.name,
        avatar_url: user.avatar_url,
        id: user.id
      }
    },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '1d'
      }
    );

    return { token, user };
  }
}

export { AuthenticateUserService };

