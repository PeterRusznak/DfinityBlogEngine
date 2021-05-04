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
}