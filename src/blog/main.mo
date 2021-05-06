import Prim "mo:prim";
import Array "mo:base/Array";
import Types "./types";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

shared({caller = initializer})  actor class(){
    type User = Types.User;
    var users: [User] = [];

    type Entry = Types.Entry;
    type InternalEntry = Types.InternalEntry;

    var entries:[InternalEntry] = [];
    var uniqueId:Nat = 0;

    public shared({caller}) func createUser(name0:Text): async(){
      let role0: Types.UserRole = if (users.size() == 0){
          #admin
      }else{
          #base
      };
      let user : User ={
          id = caller;
          role = role0;
          name = name0;
          description = "desc"
      };
      users :=  Array.append<User>(users, [user]);
    };

    public func listUsers(): async [User]{
        users
    };

    func getUser(id:Principal): ?User{
        func predicate(u:User):Bool{
            u.id == id
        };
        Array.find(users, predicate)
    };

    func isAdmin(id:Principal): Bool{
        switch(getUser(id)){
            case (null){
                return false;
            };
            case(?u){
                switch(u.role){
                    case(#admin){
                        return true;
                    };
                    case(_){
                        return false;
                    }
                }
            };
        };
    };

    public shared({caller}) func getUserList(): async [User]{
        if(isAdmin(caller) or caller == initializer){
            return users;
        };
        return [];
    };


    public shared({caller}) func setUserRole(id:Principal, newRole:Types.UserRole):  async(){
        if(isAdmin(caller) or caller == initializer){
            let u = getUser(id);    
            switch(u){
                case(null){};
                case(?u){
                    let newUser:User = {
                        id = u.id;
                        name = u.name;
                        description = u.description;
                        role = newRole;
                    };
                    func predicate(other:User):Bool{
                        other.id != u.id;
                    };
                    users := Array.append<User>(Array.filter<User>(users, predicate), [newUser]);
                };
            };    
        };
    };

    //----------------------------------------------------------------------
    
    public shared({caller}) func createEntry(title0: Text, content0:Text): async(){
        let u = getUser(caller);
        switch(u){
            case(null){
                Debug.print("User NULL, Register first");
                return;
            };
            case(?u){
                switch(u.role){
                    case(#admin or #editor){};
                    case(_){
                        Debug.print("Only admin or editor can write");
                        return;
                    };
                };
            };
        };
        uniqueId := uniqueId + 1;
        let entry: InternalEntry = {
            id = uniqueId;
            author = caller;
            content = content0;
            title = title0;
        };
        entries := Array.append<InternalEntry>(entries, [entry]);
    };

    public func seeEntries(): async [InternalEntry]{
        entries;
    };

    public query func listEntries(max: Nat): async [Entry] {
        var m = max;
        if (entries.size() == 0) {
            return [];
        };
        if (m > entries.size()) {
            m := entries.size();
        };
        func gen(i:Nat): Entry {
            let e = entries[entries.size() - i -1];
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


    public query func getEntry(id0: Nat): async ?Entry{
        func is_eq(other: InternalEntry):Bool{
            other.id == id0
        };
        switch(Array.find<InternalEntry>(entries, is_eq)){
            case(null){
                return null;
            };
            case(?e){
                func userFinder(u:User):Bool{
                    u.id == e.author
                };
                let a = Array.find(users, userFinder);
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