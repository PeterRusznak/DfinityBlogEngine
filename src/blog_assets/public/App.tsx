import React from 'react';

import { EntryList, Entry, NewEntry, NewUser } from './entry';
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
                    <Link to="/newUser">Register</Link>
                    <EntryList />
                    <Link to="/new">New Entry</Link>
                </Route>
                <Route path="/entry/:id" children={<Entry />} />
                <Route path="/new/"><NewEntry /></Route>
                <Route path="/newUser/"><NewUser /></Route>

            </Switch>
        </Router>
    );
}
export default App



