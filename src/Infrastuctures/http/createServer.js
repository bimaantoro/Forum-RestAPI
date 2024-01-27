const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const ClientError = require('../../Commons/exceptions/ClientError');
const users = require('../../Interfaces/http/api/users');
const threads = require('../../Interfaces/http/api/threads');
const authentications = require('../../Interfaces/http/api/authentications');
const comments = require('../../Interfaces/http/api/comments');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  // register external plugin
  await server.register([
    {
      plugin: Jwt.plugin,
    },
  ]);

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // bila response error, tangani sesuai kebutuhan
      const translatedError = DomainErrorTranslator.translate(response);

      // penangangan client error secara internal
      if (translatedError instanceof ClientError) {
        const newRes = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newRes.code(translatedError.statusCode);
        return newRes;
      }

      // mempertahankan penanganan client error oleh hapi secara native
      if (!translatedError.isServer) {
        return h.continue;
      }

      // penanganan server error
      const newRes = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newRes.code(500);
      return newRes;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya
    return h.continue;
  });

  return server;
};

module.exports = createServer;
