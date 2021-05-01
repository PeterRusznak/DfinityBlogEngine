import blog from 'ic:canisters/blog';

blog.greet(window.prompt("Enter your name:")).then(greeting => {
  window.alert(greeting);
});
