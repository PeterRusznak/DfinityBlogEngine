import blog from 'ic:canisters/blog';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { UserIdl } from './utils';


export const NewUser = () => {
    const [name, setName] = useState('');
    const [done, setDone] = useState(false);
    const [saving, setSaving] = useState(false);

    const submit = async () => {
        setSaving(true)
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
            <form name="new-user" className="form-group" onSubmit={() => submit()}>
                <div>
                    Name :
                    <input type="text" placeholder={name} className="form-control"
                        onChange={ev => setName(ev.target.value)} />
                </div>

                <div >
                    <button className="btn btn-primary" type="submit">
                        Submit</button>
                </div>
            </form>

            <div className="form-group">
                <Link to="/">
                    <button className="btn btn-danger" type="submit">
                        Cancel</button>
                </Link>
            </div>

        </div>
    )
};

export const UserList = () => {
    const [userList, setUserList] = useState([] as UserIdl[]);

    useEffect(() => {
        blog.getUserList().then((list: UserIdl[]) => {
            setUserList(list)
        }
        );
    }, []);

    return (
        <ol>
            {userList.map(entry => {
                //console.log(entry.role.admin);
                console.log(entry.id);
                return (<li>{entry.name} {entry.description}  </li>);
            })}
        </ol>
    );
};

