import React from 'react'
import { NewUser, UserList } from './users';
import './App.css';
import { NewEntry } from './entries';
import {
    HashRouter as Router,
    Switch,
    Route, Link,
} from 'react-router-dom';


const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Link to="/newUser">
                        <button className="btn btn-primary">New User </button>
                    </Link>
                    <Link to="/newEntry">
                        <button className="btn btn-primary">New Entry </button>
                    </Link>
                    <UserList />
                </Route>

                <Route path="/newUser/"><NewUser /></Route>
                <Route path="/newEntry/"><NewEntry /></Route>

            </Switch>
        </Router>
    )
}

export default App
