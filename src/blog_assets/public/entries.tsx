import React from 'react'
import blog from 'ic:canisters/blog';
import { useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { UserIdl, EntryIdl } from './utils';


export const NewEntry = () => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('New Entry');
    const [done, setDone] = useState(false);
    const [saving, setSaving] = useState(false);

    if (done) {
        return (<Redirect to='/' />)
    }
    if (saving) {
        return (<progress />);
    }

    const submit = async () => {
        setSaving(true);
        await blog.createEntry(title, content);
        setDone(true);
    }

    return (
        <div>
            <form name="new-entry" onSubmit={() => submit()}>
                <div>Title: <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} /></div>
                <div>Content:</div>
                <div><textarea value={content} onChange={ev => setContent(ev.target.value)} /></div>
                <div><button className="btn btn-primary" type="submit">Submit</button></div>
            </form>
            <div>
                <Link to="/">cancel</Link>
            </div>
        </div>
    );
};




