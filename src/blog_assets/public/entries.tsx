import React from 'react'
import blog from 'ic:canisters/blog';
import { useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { EntryIdl } from './utils';

const markdown = require('markdown').markdown;

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

            <div className="form-group">
                <Link to="/">
                    <button className="btn btn-danger" type="submit">
                        Cancel</button>
                </Link>
            </div>

        </div>
    );
};

export const EntryList = () => {
    const [entryList, setEntryList] = useState([] as EntryIdl[]);

    useEffect(() => {
        blog.listEntries(10).then((list: EntryIdl[]) => setEntryList(list));
    }, []);

    return (
        <ol>
            {entryList.map(entry => {
                return (
                    <li>
                        <EntrySummary entry={entry} />
                    </li>
                );
            })}
        </ol>
    );
};

export const EntrySummary = (props: { entry: EntryIdl }) => {
    const entry = props.entry;
    return (
        <div>
            <h1>{entry.title}</h1>
            <section dangerouslySetInnerHTML={{ __html: markdown.toHTML(entry.header) }}></section>
            By <span>{entry.author[0]?.name}</span>. <Link to={'/entry/' + entry.id}>view</Link>
        </div>
    );
};


export const Entry = () => {
    let { id } = useParams<{ id: string }>();
    return (
        <div>
            {id}
        </div>
    );
};
