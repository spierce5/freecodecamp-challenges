const {
  AppBar,
  Avatar,
  CssBaseline,
  ThemeProvider,
  Typography,
  Container,
  createTheme,
  Box,
  Grid,
  makeStyles,
  Button,
  IconButton,
  AddIcon,
  RemoveIcon,
  SvgIcon,
  FormControlLabel,
  Checkbox,
  TextField,
  Link } =
MaterialUI;

const theme = createTheme({
  palette: {
    primary: {
      main: "#71697A" },

    secondary: {
      main: "#E4BE9E" } } });




const START_STOP = "start_stop";
const RESET = "reset";
const BREAK_INCREMENT = "break-increment";
const BREAK_DECREMENT = "break-decrement";
const BREAK_LENGTH = "break-length";
const SESSION_INCREMENT = "session-increment";
const SESSION_DECREMENT = "session-decrement";
const SESSION_LENGTH = "session-length";

class Presentational extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minutes: 25,
      seconds: 0,
      activated: false,
      break_length: 5,
      session_length: 25,
      break: false };

    // Bindings
    this.getTimeLeft = this.getTimeLeft.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setUserInput = this.setUserInput.bind(this);
    this.getPlayPauseIcon = this.getPlayPauseIcon.bind(this);
    this.timerComplete = this.timerComplete.bind(this);
  }

  timerComplete() {
    let minutes = this.state.break ?
    this.state.session_length :
    this.state.break_length;
    this.setState({
      minutes: minutes,
      seconds: 0,
      break: !this.state.break });

  }

  componentDidMount() {
    setInterval(() => {
      if (this.state.activated) {
        if (this.state.seconds > 0) {
          this.setState({ seconds: this.state.seconds - 1 });
        } else {
          if (this.state.minutes > 0) {
            this.setState({ minutes: this.state.minutes - 1, seconds: 59 });
          } else {
            /*
            let audio = new Audio(
              "https://cdn.freesound.org/previews/196/196877_2526129-lq.mp3"
            );
            */
            let audio = document.getElementById("beep");
            audio.play();
            //timeout = setTimeout(this.timerComplete, 1000);
            this.timerComplete();
          }
        }
      }
    }, 1000);
  }
  componentWillUnmount() {}

  getTimeLeft() {
    let minutesLeft =
    this.state.minutes > 9 ?
    this.state.minutes.toString() :
    "0" + this.state.minutes.toString();
    let secondsLeft =
    this.state.seconds > 9 ?
    this.state.seconds.toString() :
    "0" + this.state.seconds.toString();
    let timeLeft = minutesLeft + ":" + secondsLeft;
    return timeLeft;
  }

  handleClick(e) {
    switch (e.currentTarget.id) {
      case START_STOP:
        this.setState({ activated: this.state.activated ? false : true });
        break;
      case RESET:
        this.setState({
          break: false,
          session_length: 25,
          break_length: 5,
          activated: false,
          minutes: 25,
          seconds: 0 });

        let audio = document.getElementById("beep");
        audio.pause();
        audio.currentTime = 0;
        break;
      case BREAK_INCREMENT:
        if (Number.isInteger(this.state.break_length)) {
          if (this.state.break_length < 60) {
            this.setState({ break_length: this.state.break_length + 1 });
          }
        }
        break;
      case BREAK_DECREMENT:
        if (this.state.break_length > 1) {
          this.setState({ break_length: this.state.break_length - 1 });
        }
        break;
      case SESSION_INCREMENT:
        var promise = new Promise((resolve, reject) => {
          if (Number.isInteger(this.state.session_length)) {
            if (this.state.session_length < 60) {
              this.setState({ session_length: this.state.session_length + 1 });
            }
            resolve();
          } else {
            reject(Error("Promise rejected"));
          }
        });

        promise.then(
        result => {
          if (!this.state.activated) {
            this.setState({
              minutes: this.state.session_length,
              seconds: 0 });

          }
        },
        function (error) {});

        break;
      case SESSION_DECREMENT:
        var promise = new Promise((resolve, reject) => {
          if (Number.isInteger(this.state.session_length)) {
            if (this.state.session_length > 1) {
              this.setState({ session_length: this.state.session_length - 1 });
            }
            resolve();
          } else {
            reject(Error("Promise rejected"));
          }
        });

        promise.then(
        result => {
          if (!this.state.activated) {
            this.setState({
              minutes: this.state.session_length,
              seconds: 0 });

          }
        },
        function (error) {});

        break;
      default:}

  }

  setUserInput(e) {
    let input = e.target.value.
    replace(/\D/, "").
    replace(/(\d{2})(.+)/, "$1").
    replace(/([7-9])(\d)/, "$1").
    replace(/6[^0]/, "6").
    replace("0", "");

    if (input != "") {
      input = parseInt(input);
    }

    switch (e.currentTarget.id) {
      case SESSION_LENGTH:
        var promise = new Promise(resolve => {
          this.setState({ session_length: input });
          resolve();
        });

        promise.then(result => {
          if (!this.state.activated) {
            this.setState({
              minutes: this.state.session_length,
              seconds: 0 });

          }
        });

        break;
      case BREAK_LENGTH:
        this.setState({ break_length: input });
        break;
      default:}

  }

  getPlayPauseIcon() {
    let icon = this.state.activated ? /*#__PURE__*/
    React.createElement("i", { class: "material-icons pause" }, "\uE034") : /*#__PURE__*/

    React.createElement("i", { class: "material-icons play_arrow" }, "\uE037");

    return icon;
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "Box" }, /*#__PURE__*/
      React.createElement(ThemeProvider, { theme: theme }, /*#__PURE__*/
      React.createElement(Box, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh" }, /*#__PURE__*/

      React.createElement(Box, {
        display: "inherit",
        flexDirection: "column",
        alignItems: "inherit",
        justifyContent: "inherit" }, /*#__PURE__*/

      React.createElement("h2", { id: "break-label", className: "primary" }, "Break Length"), /*#__PURE__*/


      React.createElement(Box, { display: "inherit", flexDirection: "row-reverse" }, /*#__PURE__*/
      React.createElement(IconButton, {
        id: "break-increment",
        onClick: this.handleClick,
        color: "primary" }, /*#__PURE__*/

      React.createElement("i", { class: "material-icons plus_one" }, "\uE800")), /*#__PURE__*/

      React.createElement(TextField, {
        error: this.state.break_length == "",
        id: "break-length",
        value: this.state.break_length,
        onChange: this.setUserInput,
        variant: "outlined",
        inputProps: {
          style: {
            textAlign: "center",
            width: "25px",
            fontWeight: "bold" } } }), /*#__PURE__*/



      React.createElement(IconButton, {
        id: "break-decrement",
        onClick: this.handleClick,
        color: "primary" }, /*#__PURE__*/

      React.createElement("i", { class: "material-icons exposure_minus_1" }, "\uE3CB")))), /*#__PURE__*/




      React.createElement(Box, {
        display: "inherit",
        flexDirection: "column",
        alignItems: "inherit",
        justifyContent: "inherit",
        ml: 5,
        mr: 5 }, /*#__PURE__*/

      React.createElement("h1", { id: "timer-label", className: "primary" },
      this.state.break ? "Break" : "Session"), /*#__PURE__*/

      React.createElement(Typography, { id: "time-left", variant: "h1", color: "secondary" },
      this.getTimeLeft()), /*#__PURE__*/

      React.createElement(Box, null, /*#__PURE__*/
      React.createElement(IconButton, { id: "start_stop", onClick: this.handleClick },
      this.getPlayPauseIcon()), /*#__PURE__*/

      React.createElement(IconButton, { id: "reset", onClick: this.handleClick }, /*#__PURE__*/
      React.createElement("i", { class: "material-icons refresh" }, "\uE5D5")), /*#__PURE__*/

      React.createElement("audio", { id: "beep" }, /*#__PURE__*/
      React.createElement("source", {
        src: "https://cdn.freesound.org/previews/196/196877_2526129-lq.mp3",
        type: "audio/mpeg" }), "Your browser does not support the audio element."), /*#__PURE__*/



      React.createElement("audio", { id: "beep" }, /*#__PURE__*/
      React.createElement("source", { src: "horse.ogg", type: "audio/ogg" }), "Your browser does not support the audio element."))), /*#__PURE__*/





      React.createElement(Box, {
        display: "inherit",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center" }, /*#__PURE__*/

      React.createElement("h2", { id: "session-label", className: "primary" }, "Session Length"), /*#__PURE__*/


      React.createElement(Box, { display: "inherit", flexDirection: "row-reverse" }, /*#__PURE__*/
      React.createElement(IconButton, {
        id: "session-increment",
        onClick: this.handleClick,
        color: "primary" }, /*#__PURE__*/

      React.createElement("i", { class: "material-icons plus_one" }, "\uE800")), /*#__PURE__*/

      React.createElement(TextField, {
        id: "session-length",
        error: this.state.session_length == "",
        value: this.state.session_length,
        onChange: this.setUserInput,
        variant: "outlined",
        inputProps: {
          style: {
            textAlign: "center",
            width: "25px",
            fontWeight: "bold" } } }), /*#__PURE__*/



      React.createElement(IconButton, {
        id: "session-decrement",
        onClick: this.handleClick,
        color: "primary" }, /*#__PURE__*/

      React.createElement("i", { class: "material-icons exposure_minus_1" }, "\uE3CB"))))))));







  }}


ReactDOM.render( /*#__PURE__*/React.createElement(Presentational, null), document.getElementById("app"));