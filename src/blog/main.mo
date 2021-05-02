import Prim "mo:prim";
import Array "mo:base/Array";
import Types "./types";

actor {

    type Entry = Types.Entry;
    type InternalEntry = Types.InternalEntry;
    type User = Types.User;

    var entries: [InternalEntry] = [];
    // TODO: Change this to a hash map.
    var users: [User] = [];
    var uniqueId: Nat = 0;

    func getUser(id: Principal): ?User {
        func predicate(u: User): Bool {
            u.id == id
        };
        Array.find(users,predicate)
    };

    func isAdmin(id: Principal): Bool {
        switch (getUser(id)) {
            case (null) {
                return false;
            };
            case (?u) {
                switch (u.role) {
                    case (#admin) { return true; };
                    case (_) { return false; };
                }
            }
        }
    };

    public shared(msg) func setUserRole(id: Principal, role0: Types.UserRole): async () {
        if (isAdmin(msg.caller)) {
            let u = getUser(id);
            switch (u) {
                case (null) {};
                case (?u) {
                    let newUser: User = {
                        id = u.id;
                        name = u.name;
                        description = u.description;
                        role = role0;
                    };
                    func predicate(c: User): Bool {
                        c.id != u.id
                    };
                    users := Array.append<User>(Array.filter<User>(users,predicate), [newUser]);
                };
            }
        }
    };

    public shared(msg) func createUser(name0: Text, desc0: Text): async () {
        let role0: Types.UserRole = if (entries.size() == 0) { #admin } else { #base };
        let user: User = {
            id = msg.caller;
            role = role0;
            name = name0;
            description = desc0;
        };
        users := Array.append<User>(users, [user]);
    };

    public shared(msg) func getUserList(): async [User] {
        if (isAdmin(msg.caller)) {
            return users;
        } else {
            return [];
        }
    };

    func entryHeader(content: Text): Text {
        let chars = content.chars();
        var text = "";
        var first = false;  // Indication that we saw a \n in the last character.
        label w for (c in chars) {
            if (c == '\r') {
                continue w;
            };
            if (c == '\n') {
                if (first) {
                    break w;
                } else {
                    first := true;
                }
            } else {
                first := false;
            };
            text := text # Prim.charToText(c);
        };
        text
    };

    public shared(msg) func newEntry(title0: Text, content0: Text): async () {
        let u = getUser(msg.caller);
        switch (u) {
            case (null) {
                return;
            };
            case (?u) {
                switch (u.role) {
                    case (#admin or #editor) {};
                    case (_) { return; }
                }
            }
        };

        uniqueId := uniqueId + 1;
        let entry: InternalEntry = {
            id = uniqueId;
            author = msg.caller;
            content = content0;
            title = title0;
        };
        entries := Array.append<InternalEntry>(entries, [entry]);
    };

    public func listUsers(): async [User] {
        users
    };

    public query func listEntries(max: Nat): async [Entry] {
        var m = max;
        if (entries.size() == 0) {
            return [];
        };
        if (m > entries.size()) {
            m := entries.size();
        };

        func gen(i: Nat): Entry {
            let e = entries[entries.size() - i - 1];
            let a = getUser(e.author);

            {
                id = e.id;
                author = a;
                title = e.title;
                header = entryHeader(e.content);
                content = null;
            }
        };
        Array.tabulate<Entry>(m, gen)
    };

    public query func getEntry(id0: Nat): async ?Entry {
        func isEq(entry: InternalEntry): Bool {
            entry.id == id0
        };

        switch (Array.find<InternalEntry>(entries,isEq)) {
            case (null) {
                return null;
            };
            case (?e) {
                func predicate(u: User): Bool {
                    u.id == e.author
                };
                let a = Array.find(users,predicate );

                return ?{
                    id = e.id;
                    author = a;
                    title = e.title;
                    header = entryHeader(e.content);
                    content = ?e.content;
                };
            };
        };
    };
};
