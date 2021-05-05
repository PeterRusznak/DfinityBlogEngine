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
            <form className="form-group" name="new-entry" onSubmit={() => submit()}>
                <div>
                    Title:
                    <input type="text" placeholder={title} className="form-control"
                        onChange={ev => setTitle(ev.target.value)} />
                </div>
                <div>Content:</div>
                <div>
                    <textarea value={content} className="form-control"
                        onChange={ev => setContent(ev.target.value)} />
                </div>
                <div>
                    <button className="btn btn-primary" type="submit">Submit</button>
                </div>
            </form>
            <div className="marginleft3perc">
                <Link to="/">cancel</Link>
            </div>
        </div>
    );
};




