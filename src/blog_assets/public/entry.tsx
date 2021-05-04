import blog from 'ic:canisters/blog';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { UserIdl } from './utils';

export function NewUser() {
    const [name, setName] = useState('');
    const [done, setDone] = useState(false);
    const [saving, setSaving] = useState(false);

    const submit = async () => {
        setSaving(true)
        console.log(name)
        await blog.createUser(name);
        setDone(true)
    }
    if (done) {
        return (<Redirect to='/' />)
    }

    if (saving) {
        return (<progress />);
    }
    return (
        <div>
            <form name="new-user" onSubmit={() => submit()}>
                <div>Name : <input type="text" value={name} onChange={ev => setName(ev.target.value)} /></div>
                <div><button type="submit">Submit</button></div>
            </form>
            <div>
                <Link to="/">cancel</Link>
            </div>
        </div>
    )
};
