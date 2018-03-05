'use strict';
const Joi = require('joi');
const MongoModels = require('mongo-models');

class Question extends MongoModels {
    
}


Question.collection = 'questions';


Question.schema = Joi.object().keys({
    _id: Joi.object(),
    question: Joi.string().required(),
    type: Joi.string().required().default('question'),
    topic: Joi.string().required().default('history'),
    date: Joi.date(),
    answers: Joi.array().items(
        Joi.object({
            answer: Joi.string().required().default('a'),
            correct: Joi.boolean().required().default(false),
            affirmation: Joi.string().allow(''),
            answer_speak: Joi.string().allow(''),
            calculated: Joi.boolean().required().default(false),
            follow_up: Joi.string().allow(''),
            alt_answers: Joi.array().items(Joi.string().required()),
        })
    ).min(2),
    provider: Joi.object({
        difficulty: Joi.string().required().default('Medium'),
        zone: Joi.string().required().default('History'),
        name: Joi.string().required().default('Trivia Group'),
        category: Joi.string().required().default('History'),
        sub_category: Joi.string().allow(''),
    }), 
    active: Joi.boolean().required(),
    test: Joi.boolean().required(),
    locales: Joi.array().items(Joi.string().required().default("en-US")),
    headline: Joi.string().allow(''),
    location: Joi.string().allow(''),
    order: Joi.string().allow(''),
    summary: Joi.string().allow(''),
    multiple_choice: Joi.boolean().required().default(false),
    points: Joi.number().integer().required().default(0),
    difficulty: Joi.number().precision(16).required(),
    total_answers: Joi.number().integer().required().default(0),
    correct_answers: Joi.number().integer().required().default(0),
    question_number: Joi.number().integer().required(),
    user_id: Joi.string().required(),
});


Question.indexes = [
    { key: { question: 1, unique: 1 } }
];


module.exports = Question;
