'use strict';
const Constants = require('./constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../helpers/parse-validation');

const initialState = {
    loading: false,
    error: undefined,
    hasError: {},
    help: {},
    questions: null,
    user: null,
    current_question: null,
};
const reducer = function (state = initialState, action) {
    if (action.type === Constants.QUESTIONS) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.QUESTIONS_RESPONSE) {
        const validation = ParseValidation(action.response);
        
        return ObjectAssign({}, state, {
            loading: false,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help,
            questions: action.response
        });
    }

    if (action.type === Constants.GET_QUESTION) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.GET_QUESTION_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help,
            current_question: action.response
        });
    }

    if (action.type === Constants.GET_USER) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.GET_USER_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            error: validation.error,
            hasError: validation.hasError,
            help: validation.help,
            user: action.response
        });
    }

    if (action.type === Constants.DELETE) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.DELETE_RESPONSE) {
        const validation = ParseValidation(action.response);

        return ObjectAssign({}, state, {
            loading: false,
            error: validation.error
        });
    }

    return state;
};


module.exports = reducer;
