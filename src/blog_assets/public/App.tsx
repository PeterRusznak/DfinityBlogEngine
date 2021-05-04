import React from 'react'
import { NewUser, UserList } from './users';
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
                    <Link to="/newUser">New User</Link>
                    <UserList />
                </Route>

                <Route path="/newUser/"><NewUser /></Route>

            </Switch>
        </Router>
    )
}

export default App
