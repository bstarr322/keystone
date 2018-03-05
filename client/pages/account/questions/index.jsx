'use strict';
const React = require('react');
const Moment = require('moment');
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

class Question extends React.Component {
    constructor(props) {

      super(props);
      
      Actions.getQuestions({});
      Actions.getUser();
      this.state = ObjectAssign({keyword: ''}, Store.getState());
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

    deleteQuestion(id) {
      console.log(id);
      let r = confirm("Do you really want to delete this question document?");
      if (r == true) {
        Actions.delete(id, this.props.history);
        Actions.getQuestions({});
        this.setState(Store.getState());
      }
    }

    search(e) {
      e.preventDefault();
      console.log(this.state.keyword);
      Actions.getQuestions({keyword: this.state.keyword});
      this.setState(Store.getState());
    }

    render() {
      console.log(this.state.data);
      let results = null;
      let checkQuiz = (!this.state.data.loading && (this.state.data.questions != null) && (this.state.data.user != null));
      let _this = this;
      if (checkQuiz) {
        results = _.map(this.state.data.questions.data, function(question, index) {
          return <tr key={index}><td onClick={_this.deleteQuestion.bind(_this, question._id)}>{checkQuiz && (_this.state.data.user._id == question.user_id) ? <i className="fa fa-trash-o" style={{color: 'red', cursor: 'pointer'}}></i> : null }</td><td style={{cursor: 'pointer'}}><a href={'/questions/' + question._id}>{question._id}</a></td><td className="truncate">{question.question}</td><td>{(new Date(question.date)).toLocaleDateString("en-US")}</td><td>{question.topic}</td><td>{((question.correct_answers / question.total_answers) * 100).toFixed(2) } %</td></tr>;
        });
      }

      return (
        <section className="section-questions container">
          <h1 className="page-header">Questions</h1>
          <input type="text" id="keyword" value={this.state.keyword} onChange={(e) => this.setState({keyword: e.target.value})} />
          <button type="button" className="btn btn-primary keyword-btn" onClick={this.search.bind(this)}>Search</button><br />
          <Link to="/questions/new" className="btn btn-primary">Create A New Question</Link>
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th></th>
                <th scope="col">ID</th>
                <th scope="col">Question</th>
                <th scope="col">Date</th>
                <th scope="col">Topic</th>
                <th scope="col">Correctness(%)</th>
              </tr>
            </thead>
            <tbody>
              {results}
            </tbody>
          </table>
        </section>
      );
    }
}

Question.propTypes = propTypes;

module.exports = Question;
