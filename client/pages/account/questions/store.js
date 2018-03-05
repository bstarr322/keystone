'use strict';
const Question = require('./reducer');
const Redux = require('redux');

module.exports = Redux.createStore(
  Redux.combineReducers({
    data: Question
  })
);
