import React from "react";
import "./register.css";
import { MdLocationOn } from "react-icons/md";
import axios from "axios";
import { ImCancelCircle } from "react-icons/im";

const Register = ({ Closeregister }) => {
  const [status, setstatus] = React.useState({});
  const username = React.useRef();
  const email = React.useRef();
  const password = React.useRef();
  const handelsubmit = async (e) => {
    e.preventDefault();
    const newobj = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
    };
    try {
      const responce = await axios.post("/user/register", newobj);
      const data = responce.data;
      console.log(data);
      setstatus(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="icondiv">
        <MdLocationOn className="icon" />
        <p>TravelLog</p>
      </div>
      <form autoComplete="on" onSubmit={handelsubmit}>
        <div className="block">
          <input type="text" id="un" placeholder="User Name" ref={username} />
        </div>
        <div className="block">
          <input
            type="email"
            autoComplete="false"
            id="mail"
            placeholder="Email"
            ref={email}
          />
        </div>
        <div className="block">
          <input
            type="password"
            id="pass"
            placeholder="password"
            ref={password}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="cancel" onClick={() => Closeregister(false)}>
        <ImCancelCircle />
      </div>

      {status && <p>{status.msg}</p>}
    </div>
  );
};

export default Register;
