/* global window */
'use strict';
const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');


class Actions {
    static getQuestions(data) {

      ApiActions.get(
        '/api/questions',
        data,
        Store,
        Constants.QUESTIONS,
        Constants.QUESTIONS_RESPONSE
      );
    }

    static createNew(data, history) {
      ApiActions.post(
        '/api/questions',
        data,
        Store,
        Constants.CREATE_NEW,
        Constants.CREATE_NEW_RESPONSE,
        (err, response) => {

          if (!err) {
              // this.hideCreateNew();

              const path = `/questions/${response._id}`;
              history.push(path);

              window.scrollTo(0, 0);
          }
        }
      );
    }

    static updateQuestion(id, data, history) {
      ApiActions.put(
        `/api/questions/${id}`,
        data,
        Store,
        Constants.UPDATE_QUESTION,
        Constants.UPDATE_QUESTION_RESPONSE,
        (err, response) => {

          if (!err) {
              const path = `/questions/${response._id}`;
              history.push(path);

              window.scrollTo(0, 0);
          }
        }
      );
    }

    static getQuestionById(id) {

      ApiActions.get(
        `/api/questions/${id}`,
        undefined,
        Store,
        Constants.GET_QUESTION,
        Constants.GET_QUESTION_RESPONSE
      );
    }

    static delete(id, history) {

      ApiActions.delete(
        `/api/questions/${id}`,
        undefined,
        Store,
        Constants.DELETE,
        Constants.DELETE_RESPONSE,
        (err, response) => {
          if (!err) {
            // history.push('/questions');

            window.scrollTo(0, 0);
          }
        }
      );
    }

    static getUser() {

      ApiActions.get(
        '/api/users/my',
        undefined,
        Store,
        Constants.GET_USER,
        Constants.GET_USER_RESPONSE
      );
    }
}

module.exports = Actions;
