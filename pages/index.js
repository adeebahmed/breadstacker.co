import Head from "next/head";
import { useState, useRef } from "react";
import styles from "../styles/Home.module.css";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import {
  MenuItem,
  FormControl,
  Select,
  Button,
  CircularProgress,
  Fade,
  InputLabel,
  Backdrop,
  Modal,
  TextField,
  Icon,
} from "@material-ui/core";
import { Timeline } from "react-twitter-widgets";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "white",
    borderRadius: 20,
    boxShadow: "5px 5px 25px 5px red",
    padding: theme.spacing(2, 4, 3),
    outline: "none",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "70%",
    marginTop: -12,
    marginLeft: -12,
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  modal: {
    "&:focus": {
      outline: "none",
    },
  },
}));

export default function Home() {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [verifyMethod, setVerifyMethod] = useState("twitter");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(false);
  const [link, setLink] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [errorReason, setErrorReason] = useState("Please enter your username");
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });
  const timer = useRef();

  const handleClose = () => {
    setModalOpen(false);
  };
  const handleOpen = (category) => {
    setModalOpen(true);
    setCategory(category);
  };

  const handleServerSubmit = async () => {
    setLoading(true);
    setValidated(false);
    if (verifyMethod === "instagram") {
      const result = await fetch("api/instagram", {
        method: "POST",
        body: JSON.stringify({ userName: username, category }),
      })
        .then((res) => res.json())
        .then((res) => {
          return res;
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          setSuccess(true);
        });
      setLoading(false);
      setSuccess(true);
      if (result.data === "usererror") {
        setError(true);
        setErrorReason(
          "Make sure your profile is public and you're following @thedeeb_"
        );
      } else if (result.data === "usernotfound") {
        setError(true);
        setErrorReason("Please check your username");
      } else if (result.data === -1) {
        setError(true);
        setErrorReason("Oh ho, looks like you're not following @thedeeb");
      } else if (result.data === "error") {
        setError(true);
        setErrorReason(
          "Sorry an internal error has occured, Please try an alternative verification method"
        );
      } else {
        setValidated(true);
        setUsername("");
        setLink(result.data);
        // window.open(result.data, "_blank");
      }
    } else if (verifyMethod === "twitter") {
      const result = await fetch("api/twitter", {
        method: "POST",
        body: JSON.stringify({ userName: username, category }),
      })
        .then((res) => res.json())
        .then((res) => {
          return res;
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          setSuccess(true);
        });
      setLoading(false);
      setSuccess(true);
      if (result.data === "usererror") {
        setError(true);
        setErrorReason(
          "Make sure your profile is public and you're following @thedeeb_"
        );
      } else if (result.data === "usernotfound") {
        setError(true);
        setErrorReason("Please check your username");
      } else if (result.data === -1) {
        setError(true);
        setErrorReason("Oh ho, looks like you're not following @thedeeb_");
      } else {
        setValidated(true);
        setLink(result.data);
        setUsername("");
        // window.open(result.data, "_blank");
      }
    } else {
    }
  };

  const renderModal = () => {
    if (verifyMethod == "instagram") {
      return (
        <div>
          <h2 id="transition-modal-title">Verify Instagram (10-20sec)</h2>
          <p style={{ fontSize: 15 }}>
            Please ensure you're following{" "}
            <b>
              <a
                href="https://instagram.com/thedeeb"
                target="_blank"
                style={{ color: "blue" }}
              >
                @thedeeb
              </a>
            </b>{" "}
            on Instagram
          </p>
          <p style={{ fontSize: 10, color: "grey˝" }}>
            Please note: - Instagram verification is a slow process and might at
            times take 2 attempts before being verified. To get instant access
            try out the Twitter verification method
          </p>
          <TextField
            style={{ width: "100%" }}
            error={error}
            id="outlined-error-helper-text"
            label="Instagram Username"
            helperText={errorReason}
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={loading}
              onClick={handleServerSubmit}
            >
              {loading ? "Please wait validating" : "Submit"}
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </div>
      );
    } else if (verifyMethod === "twitter") {
      return (
        <div>
          <h2 id="transition-modal-title">Verify Twitter (Instant)</h2>
          <p style={{ fontSize: 15 }}>
            Please ensure you're following{" "}
            <b>
              <a
                href="https://twitter.com/thedeeb_"
                target="_blank"
                style={{ color: "blue" }}
              >
                @thedeeb_
              </a>
            </b>{" "}
            on twitter
          </p>
          <p
            style={{
              fontSize: 15,
              padding: 0,
              lineHeight: 0,
              marginBottom: 30,
            }}
          >
            Ensure your twitter is set to Public.
          </p>
          <TextField
            style={{ width: "100%" }}
            disabled={loading}
            error={error}
            id="outlined-error-helper-text"
            label="@TwitterHandle"
            helperText={errorReason}
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              className={buttonClassname}
              disabled={loading}
              onClick={handleServerSubmit}
            >
              {loading ? "Please wait validating" : "Submit"}
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <span style={{ width: 400 }}></span>
          <p></p>
        </div>
      );
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>BreadStackers</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <link rel="stylesheet" href="/styles.css" /> */}
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        ></link>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          rel="stylesheet"
        ></link>
      </Head>

      <main>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: 0,
            borderRadius: 20,
          }}
          open={modalOpen}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={modalOpen}>
            <div className={classes.paper}>
              {validated ? (
                <div style={{ padding: 5 }}>
                  <p>
                    Thanks for verifying. Here’s the invite to the discord
                    community!
                  </p>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.buttonSuccess}
                    style={{ width: 100 }}
                    onClick={() => {
                      window.open(link, "_blank");
                    }}
                  >
                    Open
                  </Button>
                </div>
              ) : (
                <>
                  <FormControl style={{ minWidth: "70%" }} disabled={loading}>
                    <InputLabel id="demo-simple-select-label">
                      Select Verification Method
                    </InputLabel>
                    <Select
                      style={{ minWidth: "220px" }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      defaultValue={verifyMethod}
                      // value={age}
                      onChange={(e) => {
                        setValidated(false);
                        setVerifyMethod(e.target.value);
                      }}
                    >
                      <MenuItem value={"instagram"}>Instagram</MenuItem>
                      <MenuItem value={"twitter"}>Twitter</MenuItem>
                    </Select>
                  </FormControl>
                  {renderModal()}
                </>
              )}
            </div>
          </Fade>
        </Modal>

        {/* <div className={styles.splitTop}>
          <img
            src="https://res.cloudinary.com/jdawg/image/upload/f_auto,q_auto:eco/v1618219962/breadstackers_server_background_beziwt.jpg"
            className={styles.topImageBackground}
          />
          <img
            src="https://res.cloudinary.com/jdawg/image/upload/f_auto,q_auto:eco/v1618219962/breadstackers_server_logo_qi7bri.jpg"
            width={200}
            height={200}
            className={styles.imgstyle}
            onClick={() => handleOpen("server")}
          />
        </div> */}
        <div className={styles.splitBottom}>
          <img
            src="https://res.cloudinary.com/jdawg/image/upload/f_auto,q_auto:eco/v1618219963/breadstackers_crypto_background_vvnfhy.jpg"
            className={styles.backImageBackground}
          />
          <img
            src="https://res.cloudinary.com/jdawg/image/upload/f_auto,q_auto:eco/v1618219962/breadstackers_crypto_logo_rfgmai.jpg"
            width={200}
            height={200}
            className={styles.imgstyle}
            onClick={() => {
              setValidated(false);
              handleOpen("crypto");
            }}
          />
          <div className={styles.sidebarRight}>
            {/* Tweet and insta handles right  */}
            <Timeline
              class="twitter-timeline"
              dataSource={{
                sourceType: "profile",
                screenName: "breadstackersc",
              }}
              options={{
                theme: "dark",
                width: "400",
                height: "600",
                chrome: "nofooter,noscrollbar",
              }}
            />
            <div className={styles.socials}>
              <div style={{ flex: 1 }}>
                <div style={{display:'flex',flexDirection:'row',justifyContent:'center',}}>
                  <a href="https://instagram.com/breadstackerscrypto" target='_blank'><Icon className="fab fa-instagram" style={{fontSize:50,margin:5}}></Icon></a>
                  <a href="https://twitter.com/breadstackersc" target="_blank"><Icon className="fab fa-twitter" style={{fontSize:50,margin:5}}></Icon></a>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
