import React, { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { MdLocationOn } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/register";
import { FaSatellite, FaMapMarkedAlt } from "react-icons/fa";

import "./App.css";
import Login from "./components/login";

const mapstyles = [
  "mapbox://styles/omkarkhaire/cks1e6b2q4k8j18li0q77nx4v",
  "mapbox://styles/safak/cknndpyfq268f17p53nmpwira",
];
function App() {
  //local storage as map box automatically creates localstorage
  const mylstorage = window.localStorage;

  const [username, setusername] = useState(
    mylstorage.getItem("username") ? mylstorage.getItem("username") : ""
  );
  const [pinsdata, setpinsdata] = React.useState([]);
  const [currentpinid, setcurrentpinid] = React.useState(null);

  const [newplace, setnewplace] = React.useState(null);

  // handeling inputs

  const [title, settitle] = useState("");
  const [desc, setdesc] = useState("");
  const [ratting, setratting] = useState("");
  const [handelerror, sethandelerror] = useState("");

  //handeling inputs end

  const [showlogin, setshowlogin] = useState(false);
  const [showregister, setshowregister] = useState(false);

  //handeling maptype
  const [maptype, setmaptype] = useState(1);
  //1=geographical
  //0=satellite
  //******************** */
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 20.59,
    longitude: 78.96,
    zoom: 3.5,
  });

  //important saving user who logined ver imp

  //********************************* */

  React.useEffect(() => {
    const getpins = async () => {
      try {
        const responce = await axios.get("/pins");
        setpinsdata(responce.data);
        console.log(responce.data);
      } catch (error) {
        console.log("error occurred", error);
      }
    };
    getpins();
  }, []);

  // functions

  const handelmarkerclick = (id, latitude, longitude) => {
    setcurrentpinid(id);
    //latitude longitude only for centering map
    setViewport({ ...viewport, latitude, longitude, zoom: 5 });
  };
  const handeldoubleclicktoadd = (e) => {
    const latlong = e.lngLat; //returns array of size 2
    console.log(latlong);
    const latitude = latlong[1];
    const longitude = latlong[0];

    setnewplace({ latitude, longitude });

    //for centering
    setViewport({ ...viewport, latitude, longitude });
  };
  const handelsubmit = async (e) => {
    e.preventDefault();
    if (ratting <= 0) {
      sethandelerror("Please give ratting properly");
      return;
    }
    const newobj = {
      username,
      title,
      desc,
      ratting,
      latitude: newplace.latitude,
      longitude: newplace.longitude,
    };
    try {
      const responce = await axios.post("/pins", newobj);
      if (responce.data.status === 1) {
        sethandelerror(responce.data.msg);
        settitle("");
        setdesc("");
        setdesc("");
        setTimeout(() => {
          setnewplace(null);
          setpinsdata([...pinsdata, newobj]);
        }, 2000);
      } else {
        sethandelerror(responce.data.msg);
      }
    } catch (error) {}
  };
  const closeregsiter = (val) => {
    setshowregister(val);
  };
  const handellogout = () => {
    mylstorage.removeItem("username");
    setusername("");
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOXTOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapStyle={mapstyles[maptype]}
      // mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      // mapStyle="mapbox://styles/omkarkhaire/cks02f6m90w3n17p7uo7mdfk1"
      onDblClick={username && handeldoubleclicktoadd}
      transitionDuration="500"
    >
      {pinsdata.map((data, index) => {
        return (
          <div key={index} className="actualdiv">
            <Marker
              latitude={data.latitude}
              longitude={data.longitude}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
            >
              {/* md location is our icon */}
              <MdLocationOn
                className="icon"
                style={{
                  fontSize: viewport.zoom * 7,
                  cursor: "pointer",
                  zindex: "10",
                  color: data.username === username ? "tomato" : "slateblue",
                }}
                onClick={() =>
                  handelmarkerclick(data._id, data.latitude, data.longitude)
                }
              />
            </Marker>
            {currentpinid === data._id && (
              <Popup
                className="popup"
                latitude={data.latitude}
                longitude={data.longitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setcurrentpinid(null)}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{data.title}</h4>
                  <label>Review</label>
                  <p className="desc">{data.desc}</p>
                  <label>Rating</label>
                  <div className="starcontainer">
                    {Array(data.ratting).fill(<AiFillStar className="star" />)}
                  </div>
                  <label style={{ textTransform: "capitalize" }}>Info</label>
                  <p className="username">
                    Create by{" "}
                    <b>{data.username === username ? "You" : data.username}</b>
                  </p>
                  <p className="date">
                    {/* <b>{format(data.createdAt)}</b> */}
                    <b>{format(data.createdAt)}</b>
                  </p>
                </div>
              </Popup>
            )}
          </div>
        );
      })}
      {newplace && (
        <Popup
          className="popup"
          latitude={newplace.latitude}
          longitude={newplace.longitude}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setnewplace(null)}
          anchor="left"
        >
          <div className="dataentry">
            <form onSubmit={handelsubmit}>
              <div className="block">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter Title"
                  onChange={(e) => settitle(e.target.value)}
                />
              </div>
              <div className="block">
                <label>Review</label>
                <textarea
                  placeholder="Enter description of this place."
                  onChange={(e) => setdesc(e.target.value)}
                ></textarea>
              </div>
              <div className="block">
                <label htmlFor="title">Rating</label>
                <select onChange={(e) => setratting(e.target.value)}>
                  <option value="0">--select one--</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <button type="submit" className="addbtn">
                Add Pin
              </button>
              {handelerror && (
                <p
                  style={{
                    color: "red",
                    textAlign: "center",
                    fontWeight: "500",
                  }}
                >
                  {handelerror}
                </p>
              )}
            </form>
          </div>
        </Popup>
      )}
      <div className="btngroup">
        {username ? (
          <button className=" button1 logout" onClick={() => handellogout()}>
            Logout
          </button>
        ) : (
          <div className="btngroup">
            <button
              className="button1 login"
              onClick={() => {
                setshowlogin(true);
                setshowregister(false);
              }}
            >
              Login
            </button>
            <button
              className="button1 Register"
              onClick={() => {
                setshowregister(true);
                setshowlogin(false);
              }}
            >
              Register
            </button>
          </div>
        )}
      </div>
      {showregister && <Register Closeregister={closeregsiter} />}
      {showlogin && (
        <Login
          setshowlogin={setshowlogin}
          mylstorage={mylstorage}
          setusername={setusername}
        />
      )}

      {/* options */}

      <div className="options">
        <div className="pinitem">
          <MdLocationOn style={{ color: "tomato", fontSize: "2rem" }} />
          <h5> You</h5>
        </div>
        <div className="pinitem">
          <MdLocationOn style={{ color: "slateblue", fontSize: "2rem" }} />
          <h5>Others</h5>
        </div>
        <div
          className="pinitem"
          style={{
            borderBottom: maptype === 0 && "2px solid rgb(23, 141, 245)",
          }}
        >
          <FaSatellite
            style={{
              fontSize: "1.5rem",
              color: maptype === 0 && "rgb(23, 141, 245)",
              cursor: "pointer",
            }}
            onClick={() => setmaptype(0)}
          />
          <h5 onClick={() => setmaptype(0)} style={{ cursor: "pointer" }}>
            Sattellite
          </h5>
        </div>
        <div
          className="pinitem"
          style={{
            borderBottom: maptype === 1 && "2px solid rgb(23, 141, 245)",
          }}
        >
          <FaMapMarkedAlt
            style={{
              fontSize: "1.5rem",
              color: maptype === 1 && "rgb(23, 141, 245)",
              cursor: "pointer",
            }}
            onClick={() => setmaptype(1)}
          />
          <h5 onClick={() => setmaptype(1)} style={{ cursor: "pointer" }}>
            Geographical
          </h5>
        </div>
      </div>
    </ReactMapGL>
  );
}

export default App;
