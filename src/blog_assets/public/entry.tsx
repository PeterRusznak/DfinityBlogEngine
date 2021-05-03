/**
 * Components for entries;
 *    NewEntry
 *    EntryList
 *    EntrySummary
 *    Entry
 */

import blog from 'ic:canisters/blog';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

declare const require: any;
const markdown = require('markdown').markdown;

interface UserIdl {
    id: { toNumber(): number };
    name: string;
    description: string;
}

interface EntryIdl {
    author: [UserIdl?];
    header: string;
    content: [string?];
    title: string;
    id: { toNumber(): number };
}

export function NewUser() {

    const [name, setName] = useState('');
    const [done, setDone] = useState(false);
    const [saving, setSaving] = useState(false);

    async function submit() {
        setSaving(true);
        await blog.createUser(name);
        setDone(true);
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
    );
}


export function NewEntry() {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('New Entry');
    const [done, setDone] = useState(false);
    const [saving, setSaving] = useState(false);

    async function submit() {
        setSaving(true);

        await blog.newEntry(title, content);
        setDone(true);
    }

    if (done) {
        return (<Redirect to='/' />)
    }
    if (saving) {
        return (<progress />);
    }

    return (
        <div>
            <form name="new-entry" onSubmit={() => submit()}>
                <div>Title: <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} /></div>
                <div>Content:</div>
                <div><textarea value={content} onChange={ev => setContent(ev.target.value)} /></div>
                <div><button type="submit">Submit</button></div>
            </form>
            <div>
                <Link to="/">cancel</Link>
            </div>
        </div>
    );
}

export function Entry() {
    let { id } = useParams<{ id: string }>();
    const [entry, setEntry] = useState({} as EntryIdl);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let natId = parseInt('' + id, 10);
        if (!isFinite(natId)) {
            // Invalid string passed as number.
            throw new Error('Invalid ID: ' + JSON.stringify(id));
        }

        blog.getEntry(natId).then((optEntry: EntryIdl[]) => {
            let [entry] = optEntry;
            if (!entry) {
                // TODO: move this to a 404/403.
                throw new Error('ID not found.');
            } else {
                setEntry(entry);
                setLoading(false);
            }
        })
    });

    if (loading) {
        return (<progress />)
    } else {
        return (
            <div>
                <section><h1>{entry.title}</h1></section>
                <section dangerouslySetInnerHTML={{ __html: markdown.toHTML(entry.content[0] || entry.header) }}></section>
         By <span>{entry.author[0]?.name}</span>. <Link to="/">back</Link>
            </div>
        );
    }
}

export function EntrySummary(props: { entry: EntryIdl }) {
    const entry = props.entry;

    return (
        <div>
            <h1>{entry.title}</h1>
            <section dangerouslySetInnerHTML={{ __html: markdown.toHTML(entry.header) }}></section>
       By <span>{entry.author[0]?.name}</span>. <Link to={'/entry/' + entry.id}>view</Link>
        </div>
    );
}

export function EntryList() {
    const [entryList, setEntryList] = useState([] as EntryIdl[]);

    useEffect(() => {
        console.log("MEGHIVÓ")
        blog.listEntries(10).then((list: EntryIdl[]) => setEntryList(list));
    });

    return (
        <ol>
            {entryList.map(entry => {
                return (<li><EntrySummary entry={entry} /></li>);
            })}
        </ol>
    );
}