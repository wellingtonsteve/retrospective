import React from "react";
import Button from "react-bootstrap/Button";

const users = [
  "Liljana",
  "Cameron",
  "Matt",
  "Layne",
  "Steve",
  "Alan",
  "James"
].sort();

const LoginView = ({ loginAction }) => (
  <div>
    <div className="userlist">
      <h1>Choose your name</h1>
      {users.map(user => (
        <Button size="lg" key={user} onClick={() => loginAction(user)}>
          {user}
        </Button>
      ))}
    </div>
  </div>
);

export default LoginView;
