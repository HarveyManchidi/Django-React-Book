import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const { loginUser } = useContext(AuthContext);
  return (
    <div className="container-fluid" style={{ maxWidth: "935px" }}>
      <form onSubmit={loginUser}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Enter Username"
            name="username"
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            className="form-control"
          />
        </div>

        <button className="btn btn-success">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
