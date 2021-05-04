import Prim "mo:prim";
import Array "mo:base/Array";
import Types "./types";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

shared({caller = initializer})  actor class(){
    type User = Types.User;
    var users: [User] = []; 
}