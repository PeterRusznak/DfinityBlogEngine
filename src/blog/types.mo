module {
  public type UserRole = {
    #admin;
    #editor;
    #base;
  };

  public type User = {
    id:Principal;
    name:Text;
    role:UserRole;
    description:Text;
  };

  public type Entry = {
    id:Nat;
    author:?User;
    title:Text;
    header:Text;
    content:?Text;
  };


  public type InternalEntry = {
    id:Nat;
    author:Principal;
    title:Text;
    content:Text;
  };
}