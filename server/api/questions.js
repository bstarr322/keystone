'use strict';

const Async = require('async');
const Boom = require('boom');
const EscapeRegExp = require('escape-string-regexp');
const Joi = require('joi');
const MongoModels = require('mongo-models');

const internals = {};

internals.applyRoutes = function (server, next) {
	const Question = server.plugins['hapi-mongo-models'].Question;

	server.route({
    method: 'GET',
    path: '/questions',
    config: {
      auth: {
        strategy: 'session',
        scope: ['admin', 'account']
      },
      validate: {
        query: {
	        keyword: Joi.string().allow(''),
	        fields: Joi.string().allow(''),
          sort: Joi.string().default('-date'),
          limit: Joi.number().default(100),
          page: Joi.number().default(1)
        }
      },
      cors: {
        origin: ['*'],
        credentials: true
      },
      plugins: {
        crumb: false
      }
    },
    handler: function (request, reply) {
    	const query = {};
    	const fields = request.query.fields;
      const sort = request.query.sort;
      const limit = request.query.limit;
      const page = request.query.page;

      if (request.query.keyword) {
      	query.$or = []
      	query.$or.push({question: new RegExp('^.*?' + EscapeRegExp(request.query.keyword) + '.*$', 'i')});
      	query.$or.push({summary: new RegExp('^.*?' + EscapeRegExp(request.query.keyword) + '.*$', 'i')});
      	query.$or.push({"answers.answer_speak": new RegExp('^.*?' + EscapeRegExp(request.query.keyword) + '.*$', 'i')});
      	query.$or.push({"answers.affirmation": new RegExp('^.*?' + EscapeRegExp(request.query.keyword) + '.*$', 'i')});
      	query.$or.push({ "answers.alt_answers": new RegExp('^.*?' + EscapeRegExp(request.query.keyword) + '.*$', 'i') });
      }

      Question.pagedFind(query, fields, sort, limit, page, (err, results) => {
        if (err) {
          return reply(err);
        }

        reply(results);
      });
    }
  });

  server.route({
    method: 'POST',
    path: '/questions',
    config: {
      auth: {
        strategy: 'session',
        scope: ['admin', 'account']
      },
      validate: {
        payload: {
          question: Joi.string().required(),
			    type: Joi.string().required(),
			    topic: Joi.string().required(),
			    date: Joi.string().required(),
			    answers: Joi.array().min(2),
			    provider: Joi.object(), 
			    active: Joi.boolean().required(),
			    test: Joi.boolean().required(),
			    locales: Joi.array(),
			    headline: Joi.string().allow(''),
			    location: Joi.string().allow(''),
			    order: Joi.string().allow(''),
			    summary: Joi.string().allow(''),
			    multiple_choice: Joi.boolean().required(),
			    points: Joi.number().integer().required(),
			    difficulty: Joi.number().required(),
			    total_answers: Joi.number().integer().required(),
			    correct_answers: Joi.number().integer().required(),
			    question_number: Joi.number().integer().required(),
			    user_id: Joi.string().required(),
        }
      },
      cors: {
        origin: ['*'],
        credentials: true
      },
      plugins: {
        crumb: false
      }
    },
    handler: function (request, reply) {
    	console.log(request.payload);
      Question.insertOne(request.payload, (err, question) => {
        if (err) {
          return reply(err);
        }

        reply(question);
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/questions/{id}',
    config: {
      auth: {
        strategy: 'session',
        scope: ['admin', 'account']
      },
      cors: {
        origin: ['*'],
        credentials: true
      },
      plugins: {
        crumb: false
      }
    },
    handler: function (request, reply) {
      Question.findById(request.params.id, (err, question) => {
        if (err) {
            return reply(err);
        }

        if (!question) {
            return reply(Boom.notFound('Document not found.'));
        }

        reply(question);
      });
    }
	});

  server.route({
    method: 'PUT',
    path: '/questions/{id}',
    config: {
      auth: {
        strategy: 'session',
        scope: ['admin', 'account']
      },
      validate: {
        payload: {
          question: Joi.string().required(),
			    type: Joi.string().required(),
			    topic: Joi.string().required(),
			    date: Joi.date(),
			    answers: Joi.array().min(2),
			    provider: Joi.object(), 
			    active: Joi.boolean().required(),
			    test: Joi.boolean().required(),
			    locales: Joi.array(),
			    headline: Joi.string().allow(''),
			    location: Joi.string().allow(''),
			    order: Joi.string().allow(''),
			    summary: Joi.string().allow(''),
			    multiple_choice: Joi.boolean().required(),
			    points: Joi.number().integer().required(),
			    difficulty: Joi.number().required(),
			    total_answers: Joi.number().integer().required(),
			    correct_answers: Joi.number().integer().required(),
			    question_number: Joi.number().integer().required(),
			    user_id: Joi.string().required(),
        }
      },
      cors: {
        origin: ['*'],
        credentials: true
      },
      plugins: {
        crumb: false
      }
    },
    handler: function (request, reply) {
      const id = request.params.id;
      const update = {
        $set: request.payload
      };

      Question.findByIdAndUpdate(id, update, (err, question) => {
        if (err) {
          return reply(err);
        }

        if (!question) {
            return reply(Boom.notFound('Document not found.'));
        }

        reply(question);
      });
    }
	});

	server.route({
    method: 'DELETE',
    path: '/questions/{id}',
    config: {
      auth: {
          strategy: 'session',
          scope: ['admin', 'account']
      },
      cors: {
        origin: ['*'],
        credentials: true
      },
      plugins: {
        crumb: false
      }
    },
    handler: function (request, reply) {
      Question.findByIdAndDelete(request.params.id, (err, question) => {
        if (err) {
            return reply(err);
        }

        if (!question) {
            return reply(Boom.notFound('Document not found.'));
        }

        reply({ success: true });
      });
    }
	});


	next();
};

exports.register = function (server, options, next) {
    server.dependency(['auth', 'hapi-mongo-models'], internals.applyRoutes);
    next();
};


exports.register.attributes = {
  name: 'questions'
};