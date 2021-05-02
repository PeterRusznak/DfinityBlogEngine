import React from 'react';

import { EntryList, Entry, NewEntry } from './entry.tsx';
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
                    <EntryList />
                    <Link to="/new">New Entry</Link>
                </Route>
                <Route path="/entry/:id" children={<Entry />} />
                <Route path="/new/"><NewEntry /></Route>

            </Switch>
        </Router>
    );
}
export default App



