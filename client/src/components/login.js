import React from "react";
import { MdLocationOn } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";
import axios from "axios";

const Login = ({ setshowlogin, mylstorage, setusername }) => {
  const [status, setstatus] = React.useState({});
  const email = React.useRef();
  const password = React.useRef();

  const handelsubmit = async (e) => {
    e.preventDefault();
    if (email.current.value <= 0 || password.current.value <= 0) {
      setstatus({ msg: "Enter valid data" });
      return;
    }
    const newobj = {
      username: email.current.value,
      password: password.current.value,
    };
    try {
      const responce = await axios.post("/user/login", newobj);
      const data = responce.data;
      console.log(data);
      //setting to local storage
      if (data.userName) {
        mylstorage.setItem("username", data.userName);
        setusername(data.userName);
        setstatus(data);

        setTimeout(() => {
          setshowlogin(false);
        }, 2000);
      } else {
        setstatus(data);
      }
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
          <input
            type="text"
            autoComplete="false"
            id="mail"
            placeholder="User Name"
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
        <button type="submit">Login</button>
      </form>
      <div className="cancel" onClick={() => setshowlogin(false)}>
        <ImCancelCircle />
      </div>
      {status && <p className="status">{status.msg}</p>}
    </div>
  );
};

export default Login;
