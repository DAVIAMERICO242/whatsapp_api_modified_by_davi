const { globalApiKey, rateLimitMax, rateLimitWindowMs } = require('./config')
const { sendErrorResponse } = require('./utils')
const { validateSession } = require('./sessions')
const rateLimiting = require('express-rate-limit')
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./databases/whatsapp_robusto.sql')


const authMiddleware = async (req, res, next) => {//autorização login
  if (req.session.name) {
      // Usuário autenticado, permitir que a solicitação prossiga
      console.log('ANYYY')
      next();
  } else {
      res.status(404).send('Não Autorizado');
  }
};

const API_authMiddleware = async (req, res, next) => {//futuramente sera apikey
  next();
};


const apikey = async (req, res, next) => {
  /*
    #swagger.security = [{
          "apiKeyAuth": []
    }]
  */
  /* #swagger.responses[403] = {
        description: "Forbidden.",
        content: {
          "application/json": {
            schema: { "$ref": "#/definitions/ForbiddenResponse" }
          }
        }
      }
  */
  console.log('PELOMENOS ENTROU 0') 
  if (globalApiKey) {
    console.log('PELOMENOS ENTROU')
    const selectAllTokens = `SELECT * FROM allowed_tokens;`;
    var allowed_tokens = [];
    const fetchDataFromDB = async () => {
      return new Promise((resolve, reject) => {
        db.all(selectAllTokens, [], (err, rows) => {
          if (err) {
            console.log('AA');
            reject(err);
          }
    
          // Log the results
          rows.forEach((row) => {
            allowed_tokens.push(row.token);
          });
    
          resolve();
        });
      });
    };
    await fetchDataFromDB();
    const apiKey = req.headers['x-api-key'].trim().replace(/\s+/g, ' ').toUpperCase();
    if (!apiKey || !(allowed_tokens.includes(apiKey))) {
      console.log('NAO VALIDADO')
      console.log(apiKey)
      res.status(404).send('x-api-key inválida');
    }else{
      next();
    }
  }else{
    res.status(404).send('GLOBAL API ERROR');
  }
}

const sessionNameValidation = async (req, res, next) => {
  /*
    #swagger.parameters['sessionId'] = {
      in: 'path',
      description: 'Unique identifier for the session (alphanumeric and - allowed)',
      required: true,
      type: 'string',
      example: 'f8377d8d-a589-4242-9ba6-9486a04ef80c'
    }
  */
  if ((!/^[\w-]+$/.test(req.params.sessionId))) {
    /* #swagger.responses[422] = {
        description: "Unprocessable Entity.",
        content: {
          "application/json": {
            schema: { "$ref": "#/definitions/ErrorResponse" }
          }
        }
      }
    */
    console.log('ANTES DO RETURN')
    return sendErrorResponse(res, 422, 'Session should be alphanumerical or -')
  }
  console.log('DEPOIS DO RETURN')
  next()
}

const sessionValidation = async (req, res, next) => {
  const validation = await validateSession(req.params.sessionId)
  if (validation.success !== true) {
    /* #swagger.responses[404] = {
        description: "Not Found.",
        content: {
          "application/json": {
            schema: { "$ref": "#/definitions/NotFoundResponse" }
          }
        }
      }
    */
    return sendErrorResponse(res, 404, validation.message)
  }
  next()
}

const rateLimiter = rateLimiting({
  max: rateLimitMax,
  windowMS: rateLimitWindowMs,
  message: "You can't make any more requests at the moment. Try again later"
})

const sessionSwagger = async (req, res, next) => {
  /*
    #swagger.tags = ['Session']
  */
  next()
}

const clientSwagger = async (req, res, next) => {
  /*
    #swagger.tags = ['Client']
  */
  next()
}

const contactSwagger = async (req, res, next) => {
  /*
    #swagger.tags = ['Contact']
    #swagger.requestBody = {
      required: true,
      schema: {
        type: 'object',
        properties: {
          contactId: {
            type: 'string',
            description: 'Unique whatsApp identifier for the contact',
            example: '6281288888888@c.us'
          }
        }
      }
    }
  */
  next()
}

const messageSwagger = async (req, res, next) => {
  /*
    #swagger.tags = ['Message']
    #swagger.requestBody = {
      required: true,
      schema: {
        type: 'object',
        properties: {
          chatId: {
            type: 'string',
            description: 'The Chat id which contains the message',
            example: '6281288888888@c.us'
          },
          messageId: {
            type: 'string',
            description: 'Unique whatsApp identifier for the message',
            example: 'ABCDEF999999999'
          }
        }
      }
    }
  */
  next()
}

const chatSwagger = async (req, res, next) => {
  /*
    #swagger.tags = ['Chat']
    #swagger.requestBody = {
      required: true,
      schema: {
        type: 'object',
        properties: {
          chatId: {
            type: 'string',
            description: 'Unique whatsApp identifier for the given Chat (either group or personnal)',
            example: '6281288888888@c.us'
          }
        }
      }
    }
  */
  next()
}

const groupChatSwagger = async (req, res, next) => {
  /*
    #swagger.tags = ['Group Chat']
    #swagger.requestBody = {
      required: true,
      schema: {
        type: 'object',
        properties: {
          chatId: {
            type: 'string',
            description: 'Unique whatsApp identifier for the given Chat (either group or personnal)',
            example: '6281288888888@c.us'
          }
        }
      }
    }
  */
  next()
}

module.exports = {
  authMiddleware,
  API_authMiddleware,
  sessionValidation,
  apikey,
  sessionNameValidation,
  sessionSwagger,
  clientSwagger,
  contactSwagger,
  messageSwagger,
  chatSwagger,
  groupChatSwagger,
  rateLimiter
}
