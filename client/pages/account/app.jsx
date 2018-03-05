'use strict';
const Footer = require('./footer.jsx');
const Home = require('./home/index.jsx');
const Navbar = require('./navbar.jsx');
const NotFound = require('./not-found.jsx');
const React = require('react');
const ReactRouter = require('react-router-dom');
const Settings = require('./settings/index.jsx');
const Question = require('./questions/index.jsx');
const CreateQuestion = require('./questions/create.jsx');
const ShowQuestion = require('./questions/show.jsx');
const EditQuestion = require('./questions/edit.jsx');
const Route = ReactRouter.Route;
const Router = ReactRouter.BrowserRouter;
const Switch = ReactRouter.Switch;


const App = (
    <Router>
        <div>
            <Route component={Navbar} />
            <Switch>
                <Route path="/account" exact component={Home} />
                <Route path="/account/settings" exact component={Settings} />
                <Route path="/questions" exact component={Question} />
                <Route path="/questions/new" exact component={CreateQuestion} />
                <Route path="/questions/:id" exact component={ShowQuestion} />
                <Route path="/questions/:id/edit" component={EditQuestion} />
                <Route component={NotFound} />
            </Switch>
            <Footer />
        </div>
    </Router>
);


module.exports = App;
