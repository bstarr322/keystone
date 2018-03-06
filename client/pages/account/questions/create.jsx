'use strict';
const React = require('react');
import DatePicker from 'react-datepicker';
const moment = require('moment');
import 'react-datepicker/dist/react-datepicker.css';
const $ = require("jquery");
const Actions = require('./actions');
const ReactRouter = require('react-router-dom');
const Store = require('./store');
const ObjectAssign = require('object-assign');
const PropTypes = require('prop-types');
const _ = require("lodash");

const propTypes = {
  history: PropTypes.object,
};

class CreateQuestion extends React.Component {
    constructor(props) {

      super(props);
      
      let initialState = ObjectAssign({startDate: moment(), num_answers: 2, notifications: []}, Store.getState());
      this.state = initialState;
      Actions.getUser();

      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.unsubscribeStore = Store.subscribe(this.onStoreChange.bind(this));

      // this.addEvents();
    }

    componentWillUnmount() {
      this.unsubscribeStore();
    }

    onStoreChange() {
      this.setState(Store.getState());
    }

    handleChange(date) {
      this.setState({
        startDate: date
      });
    }

    onSubmit(e) {
      e.preventDefault();
      
      let question = {};

      question.question = $('#question').val();
      question.type = $('#type').val();
      question.topic = $('#topic').val();
      question.date = moment(this.state.startDate).format("YYYY-MM-DD");
      
      question.answers = [];
      let num_answers = $('.panel.each-answer').length;
      for (var i = 0; i < num_answers; i++) {
        let follow_up = $(".panel.each-answer").eq(i).find("select.follow_up").val();
        if (follow_up == null) {
          follow_up = '';
        }
        let answer = {
          answer: $(".panel.each-answer").eq(i).find('input.answer').val(),
          correct: $(".panel.each-answer").eq(i).find("input.correct").prop('checked'),
          affirmation: $(".panel.each-answer").eq(i).find('input.affirmation').val(),
          answer_speak: $(".panel.each-answer").eq(i).find('input.answer_speak').val(),
          calculated: $(".panel.each-answer").eq(i).find("input.calculated").prop('checked'),
          follow_up: follow_up,
          alt_answers: $(".panel.each-answer").eq(i).find('.each input').map(function(idx, elem) { return $(elem).val(); }).get()
        }

        question.answers.push(answer);
      }

      question.provider = {};
      question.provider.difficulty = $("select[name='question.provider.difficulty']").val();
      question.provider.zone = $("select[name='question.provider.zone']").val();
      question.provider.name = $("input[name='question.provider.name']").val();
      question.provider.category = $("select[name='question.provider.category']").val();
      question.provider.sub_category = $("input[name='question.provider.sub_category']").val();

      question.headline = $("input[name='question.headline']").val();
      question.location = $("input[name='question.location']").val();
      question.order = $("input[name='question.order']").val();
      question.summary = $("input[name='question.summary']").val(); 

      question.multiple_choice = $("input[name='question.multiple_choice']").prop('checked');
      question.active = $("input[name='question.active']").prop('checked');
      question.test = $("input[name='question.test']").prop('checked');
      question.locales = $("select[name='question.locales[]']").val();
      question.points = parseInt($("select[name='question.points']").val());
      question.difficulty = (isNaN(parseInt($("input[name='question.difficulty']").val())) ? 0 : parseFloat($("input[name='question.difficulty']").val()));
      question.total_answers = (isNaN(parseInt($("input[name='question.total_answers']").val())) ? 0 : parseInt($("input[name='question.total_answers']").val()));
      question.question_number = (isNaN(parseInt($("input[name='question.question_number']").val())) ? 0 : parseInt($("input[name='question.question_number']").val()));
      question.correct_answers = (isNaN(parseInt($("input[name='question.correct_answers']").val())) ? 0 : parseInt($("input[name='question.correct_answers']").val()));
      question.user_id = this.state.data.user._id;
      
      console.log(question);

      let errors = [];
      if (question['question'] == '') {
        errors.push('Question is required');
      }

      if (question['answers'].length < 2) {
        errors.push('Answers should be more than 1'); 
      }

      if (errors.length == 0) {
        Actions.createNew(question, this.props.history);
      } else {
        this.setState({notifications: errors});
        window.scrollTo(0, 0);
      }
      
    }

    newAnswer(e) {
      e.preventDefault();
      // this.setState({num_answers: this.state.num_answers + 1 });
      
      let html = '';
      html += '<div class="panel form-inline each-answer">';
      html += '<h5>';
      html += '<div class="form-group">';
      html += '<label for="answer">Answer</label>';
      html += '<input type="text" class="form-control answer" placeholder="a" />';
      html += '</div>';
      html += '<i class="fa fa-close" style="font-size: 24px"></i>'  
      html += '</h5><br />';
      html += '<div class="checkbox">';
      html += '<label><input type="checkbox" class="form-control correct" />Correct?</label>';
      html += '</div><br />';
      html += '<div class="form-group"><label for="affirmation">affirmation</label><input type="text" class="form-control affirmation" placeholder="affirmation" /></div><br />';
      
      html += '<div class="form-group"><label for="answer_speak">Answer Speak</label><input type="text" class="form-control answer_speak" placeholder="A., Yellow Submarine" /></div><br />';
      html += '<div class="checkbox"><label><input type="checkbox" class="form-control calculated" defaultChecked />Calculated?</label></div><br />';
      html += '<div class="form-group"><label for="topic">Follow Up</label><select class="form-control follow_up" ></select></div><br />';
      
      // Alt Answers
      html += '<div class="form-group alt_answers">';     
      html += '<label for="alt_answers">Alt Answers<button class="btn btn-primary">+</button></label>';
      html += '<div class="controls">'
      html += '<div class="each">';
      html += '<input type="text" class="form-control" placeholder="A., Yellow Submarine" />';
      html += '<i class="fa fa-close" style="font-size: 24px;"></i>';
      html += '</div>';
      html += '<div class="each">';
      html += '<input type="text" class="form-control" placeholder="A., Yellow Submarine" />';
      html += '<i class="fa fa-close" style="font-size: 24px;"></i>';
      html += '</div>';                
      html += '</div>';
               
      html += '</div>';
      html += '</div>';
      
      $('.answers').append(html);
      $('.panel.each-answer h5 .fa-close').off('click');
      $('.panel.each-answer h5 .fa-close').on('click', function() {
        $(this).closest('.panel.each-answer').remove();
      });

      this.addEvents();
    }

    addEvents() {
      $('.alt_answers .each .fa-close').off('click');
      $('.alt_answers .each .fa-close').on('click', function() {
        $(this).closest('.each').remove();
      });

      $('.alt_answers button').off('click');
      $('.alt_answers button').on('click', function(e) {
        e.preventDefault();
        $(this).closest('.alt_answers').find('.controls').append('<div class="each"><input type="text" class="form-control" placeholder="A., Yellow Submarine" /><i class="fa fa-close" style="font-size: 24px;"></i></div>');
        $('.alt_answers .each .fa-close').off('click');
        $('.alt_answers .each .fa-close').on('click', function() {
          $(this).closest('.each').remove();
        });
      });
    }

    render() {
      // let a = [];
      // for (var i = 0; i < this.state.num_answers; i++) {
      //   a.push(i);
      // }
      // let _this = this;
      // let answers = _.map(a, function(index) {
      //   return (<div className="panel form-inline answer" key={index}>
      //     <h5>
      //       <div className="form-group">
      //         <label htmlFor="answer">Answer</label>
      //         <input type="text" className="form-control answer" name={"question.answers[" + index + "].answer"} placeholder="a" />
      //       </div>
      //       <i className="fa fa-close" style={{fontSize: '24px'}} onClick={_this.removeAnswer.bind(_this)}></i>
      //     </h5><br />
      //     <div className="checkbox">
      //       <label>
      //         <input type="checkbox" name={"question.answers[" + index + "].correct"} className="form-control correct" />Correct?
      //       </label>
      //     </div>
      //     <br />
      //     <div className="form-group">
      //       <label htmlFor="affirmation">affirmation</label>
      //       <input type="text" className="form-control affirmation" name={"question.answers[" + index + "].affirmation"} placeholder="affirmation" />
      //     </div>
      //     <br />
      //     <div className="form-group">
      //       <label htmlFor="answer_speak">Answer Speak</label>
      //       <input type="text" className="form-control answer_speak" name={"question.answers[" + index + "].answer_speak"} placeholder={"A., Yellow Submarine"} />
      //     </div>
      //     <br />
      //     <div className="checkbox">
      //       <label>
      //         <input type="checkbox" name={"question.answers[" + index + "].calculated"} className="form-control calculated" defaultChecked />Calculated?
      //       </label>
      //     </div>
      //     <br />
          
      //     <div className="form-group">
      //       <label htmlFor="topic">Follow Up</label>
      //       <select className="form-control follow_up" name={"question.answers[" + index + "].follow_up"}>
      //       </select>
      //     </div>
      //     <br />
      //     <div className="form-group alt_answers">
      //       <label htmlFor="alt_answers">Alt Answers<button className="btn btn-primary">+</button></label>
      //       <div className="controls">
      //         <div className="each">
      //           <input type="text" className="form-control" placeholder="A., Yellow Submarine" />
      //           <i className="fa fa-close" style={{fontSize: '24px'}}></i>
      //         </div>
      //         <div className="each">
      //           <input type="text" className="form-control" placeholder="A., Yellow Submarine" />
      //           <i className="fa fa-close" style={{fontSize: '24px'}}></i>
      //         </div> 
      //       </div>
      //     </div>

      //   </div>);  
      // });

      let notifications = _.map(this.state.notifications, function(error, index) {
        return <li key={index}>{error}</li>;
      });

      return (
        <section className="section-questions-create container">
          <h1 className="page-header">New Question</h1>
          <ul className="notifications">{notifications}</ul>
          <form id="create_form">
            <div className="form-group">
              <label htmlFor="question">Question</label>
              <textarea className="form-control" id="question" name="question.question" rows="4" cols="50"></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select className="form-control" id="type" name="question.type" defaultValue="question">
                <option value="question">question</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="topic">Topic</label>
              <select className="form-control" id="topic" name="question.topic" defaultValue="history">
                <option value="history">history</option>
                <option value="world trivia">world trivia</option>
                <option value="general knowledge">general knowledge</option>
                <option value="movies and tv">movies and tv</option>
                <option value="sports">sports</option>
                <option value="pop culture">pop culture</option>
                <option value="current affairs">current affairs</option>
                <option value="arts and enterttainment">arts and enterttainment</option>
                <option value="arts and entertainment">arts and entertainment</option>
                <option value="general wisdom">general wisdom</option>
                <option value="technology">technology</option>
                <option value="music">music</option>
                <option value="movies">movies</option>
                <option value="literature">literature</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <DatePicker className="form-control" id="date" name="question.date" selected={this.state.startDate} onChange={this.handleChange} />
            </div>
            <hr />
            <div className="checkbox">
              <label>
                <input type="checkbox" name="question.multiple_choice" />Multiple?
              </label>
            </div>
            <div className="form-group answers">
              <label htmlFor="answer">Answers</label>
              <button id="answer" className="btn btn-primary" onClick={this.newAnswer.bind(this)}>New Answer</button>
            </div>
            <hr />
            <div className="form-group">
              <label htmlFor="provider">Provider</label>
              <div className="panel form-inline answer">
                <div className="form-group">
                  <label htmlFor="difficulty">Difficulty</label>
                  <select className="form-control" name="question.provider.difficulty" defaultValue="Medium">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="zone">Zone</label>
                  <select className="form-control" name="question.provider.zone" defaultValue="history">
                    <option value="History">History</option>
                    <option value="Music">Music</option>
                    <option value="World Trivia">World Trivia</option>
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="Sports">Sports</option>
                    <option value="Sports (US)">Sports (US)</option>
                    <option value="Current Affairs">Current Affairs</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Movies">Movies</option>
                    <option value="Movies & TV">Movies & TV</option>
                    <option value="Pop Culture">Pop Culture</option>
                    <option value="General Wisdom">General Wisdom</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" className="form-control" id="name" name="question.provider.name" defaultValue="Trivia Group" />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select className="form-control" name="question.provider.category" defaultValue="history">
                    <option value="History">History</option>
                    <option value="Music">Music</option>
                    <option value="World Trivia">World Trivia</option>
                    <option value="General Knowledge">General Knowledge</option>
                    <option value="Sports">Sports</option>
                    <option value="Sports (US)">Sports (US)</option>
                    <option value="Current Affairs">Current Affairs</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Movies">Movies</option>
                    <option value="Movies & TV">Movies & TV</option>
                    <option value="Pop Culture">Pop Culture</option>
                    <option value="General Wisdom">General Wisdom</option>
                    <option value="Technology">Technology</option>
                  </select>
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="sub_category">Subcategory</label>
                  <input type="text" className="form-control" id="sub_category" name="question.provider.sub_category" />
                </div>
              </div>
            </div>
            <hr />
            <div className="checkbox">
              <label>
                <input type="checkbox" name="question.active" />Active?
              </label>
            </div>
            <div className="checkbox">
              <label>
                <input type="checkbox" name="question.test" />Test?
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="locales">Locales</label>
              <select className="form-control" name="question.locales[]" multiple="true" defaultValue={["en-US"]} >
                <option value="en-US">en-US</option>
                <option value="en-GB">en-GB</option>
                <option value="en-CA">en-CA</option>
                <option value="en-AU">en-AU</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="points">points</label>
              <select className="form-control" name="question.points" defaultValue="5">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="headline">Headline</label>
              <input type="text" className="form-control" name="question.headline" />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input type="text" className="form-control" name="question.location" />
            </div>
            <div className="form-group">
              <label htmlFor="order">Order</label>
              <input type="text" className="form-control" name="question.order" />
            </div>
            <div className="form-group">
              <label htmlFor="summary">Summary</label>
              <input type="text" className="form-control" name="question.summary" />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <input type="number" className="form-control" name="question.difficulty" min="0" />
            </div>
            <div className="form-group">
              <label htmlFor="total_answers">Total Answers</label>
              <input type="number" className="form-control" name="question.total_answers" min="0" />
            </div>
            <div className="form-group">
              <label htmlFor="question_number">Quetion Number</label>
              <input type="number" className="form-control" name="question.question_number" min="0" />
            </div>
            <div className="form-group">
              <label htmlFor="correct_answers">Correct Answers</label>
              <input type="number" className="form-control" name="question.correct_answers" min="0" />
            </div>
            <button type="submit" className="btn btn-primary" onClick={this.onSubmit.bind(this)}>Submit</button>
          </form>
        </section>
      );
    }
}

CreateQuestion.propTypes = propTypes;

module.exports = CreateQuestion;
