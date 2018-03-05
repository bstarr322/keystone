'use strict';
const React = require('react');
import DatePicker from 'react-datepicker';
const moment = require('moment');
import 'react-datepicker/dist/react-datepicker.css';
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';
const $ = require("jquery");
// const serialize = require('form-serialize-json');
const Actions = require('./actions');
const ReactRouter = require('react-router-dom');
const Link = ReactRouter.Link;
const Store = require('./store');
const ObjectAssign = require('object-assign');
const PropTypes = require('prop-types');
const _ = require("lodash");

const propTypes = {
  history: PropTypes.object,
};

class ShowQuestion extends React.Component {
    constructor(props) {

      super(props);
      
      Actions.getQuestionById(this.props.match.params.id);
      Actions.getUser();
      this.state = Store.getState();
    }

    componentDidMount() {
      this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));
    }

    componentWillUnmount() {
      this.unsubscribeStore();
    }

    onStoreChange() {
      this.setState(Store.getState());
    }

    render() {
      console.log(this.state);
      let answers = null;
      let checkQuiz = (!this.state.data.loading && (this.state.data.current_question != null) && (this.state.data.user != null));
      if (checkQuiz) {
        answers = _.map(this.state.data.current_question.answers, function(answer, index) {
          return <li key={index}>{answer.answer_speak}</li>;
        });
      }

      return (
        <section className="section-questions-show container">
          <p className="notifications"></p>
          <h1 className="page-header">Show Question</h1>
          <div className="row">
            <div className="col-sm-2"><b>ID</b></div>
            <div className="col-sm-10">{ checkQuiz ? this.state.data.current_question._id : null }</div>
          </div>
          <div className="row">
            <div className="col-sm-2"><b>Question</b></div>
            <div className="col-sm-10">{ checkQuiz ? this.state.data.current_question.question : null }</div>
          </div>
          <div className="row">
            <div className="col-sm-2"><b>Date</b></div>
            <div className="col-sm-10">{ checkQuiz ? (new Date(this.state.data.current_question.date)).toLocaleDateString("en-US") : null }</div>
          </div>
          <div className="row">
            <div className="col-sm-2"><b>Answers</b></div>
            <div className="col-sm-10">
              <ul>
                {answers}
              </ul>
            </div>
          </div>
          {
            checkQuiz && (this.state.data.user._id == this.state.data.current_question.user_id) ?
            <a href={'/questions/' + this.state.data.current_question._id + '/edit' } className="btn btn-primary">Edit Question</a> : null 
          }
        </section>
      );
    }
}

ShowQuestion.propTypes = propTypes;

module.exports = ShowQuestion;
