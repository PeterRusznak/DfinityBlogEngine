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
}