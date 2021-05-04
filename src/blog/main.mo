import Prim "mo:prim";
import Array "mo:base/Array";
import Types "./types";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

shared({caller = initializer})  actor class(){
    type User = Types.User;
    var users: [User] = [];

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
}