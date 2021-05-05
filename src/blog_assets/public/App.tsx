import React from 'react'
import { NewUser, UserList } from './users';
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
                    <Link to="/newUser"><button  >NEW USER </button></Link>
                    <Link to="/newEntry">New Entry</Link>
                    <UserList />
                </Route>

                <Route path="/newUser/"><NewUser /></Route>
                <Route path="/newEntry/"><NewEntry /></Route>

            </Switch>
        </Router>
    )
}

export default App
