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
  SvgIcon,
  FormControlLabel,
  Checkbox,
  TextField,
  Link } =
MaterialUI;

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6" },

    secondary: {
      main: "#19857b" },

    error: {
      main: '#F44336' },

    background: {
      default: "#fff" } } });




const ID_MAP = {
  'divide': '/',
  'nine': '9',
  'eight': '8',
  'seven': '7',
  'multiply': '*',
  'six': '6',
  'five': '5',
  'four': '4',
  'subtract': '-',
  'three': '3',
  'two': '2',
  'one': '1',
  'add': '+',
  'decimal': '.',
  'zero': '0' };


class Presentational extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '0' };

    // Bindings
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.removeInvalidChars = this.removeInvalidChars.bind(this);
    this.calculate = this.calculate.bind(this);
  }

  componentWillMount() {

  }

  calculate(equation) {
    console.log(equation);
    let inputs = equation.split('');
    console.log(inputs);
    //Bug: 0.3-.1
    for (let i = 1; i < inputs.length; i++) {
      if (inputs[i] == '-' && /\D/.test(inputs[i - 1])) {
        let neg = (parseFloat(inputs[i + 1]) * -1).toString();
        inputs.splice(i, 2, neg);
      }
    }
    for (let i = 1; i < inputs.length; i++) {
      if (/\+|\-|\*|\÷/.test(inputs[i - 1]) && inputs[i] == '-' && inputs[i + 1] == '.') {
        inputs.splice(i, 3, (parseFloat(inputs[i + 1] + inputs[i + 2]) * -1).toString());
      }
    }
    for (let i = 1; i < inputs.length; i++) {
      if (/\d+|\./.test(inputs[i]) && /\d+|\./.test(inputs[i - 1])) {
        inputs.splice(i - 1, 2, inputs[i - 1] + inputs[i]);
        i -= 1;
      }
    }
    console.log(inputs);
    let resultArray = [...inputs];
    let idx = 1;
    while (['*', '÷'].some(val => resultArray.includes(val))) {
      let current = resultArray[idx];
      let last = resultArray[idx - 1];
      let next = resultArray[idx + 1];
      if (current == '*') {
        resultArray.splice(idx - 1, 3, (parseFloat(last) * parseFloat(next)).toString());
      } else
      if (current == '÷') {
        resultArray.splice(idx - 1, 3, (parseFloat(last) / parseFloat(next)).toString());
      } else
      {
        idx += 2;
      }
    }
    idx = 1;
    while (['-', '+'].some(val => resultArray.includes(val))) {
      let current = resultArray[idx];
      let last = resultArray[idx - 1];
      let next = resultArray[idx + 1];
      if (current == '+') {
        resultArray.splice(idx - 1, 3, (parseFloat(last) + parseFloat(next)).toString());
      } else
      if (current == '-') {
        resultArray.splice(idx - 1, 3, (parseFloat(last) - parseFloat(next)).toString());
      } else
      {
        idx += 2;
      }
    }
    this.setState({ value: resultArray[0] });
  }

  removeInvalidChars(val) {
    const newVal = val.replace(/[^0-9|^\+|^\-|^\/|^\*|^÷|^\.]/g, '').
    replace(/\//, '÷').
    replace(/\*{2,}/, '*').
    replace(/\/{2,}/, '÷').
    replace(/\+{2,}/, '+').
    replace(/\-{2,}/, '-').
    replace(/\÷{2,}/, '÷').
    replace(/\-\+/, '+').
    replace(/\+\*/, '*').
    replace(/\*\+/, '+').
    replace(/\+\÷/, '÷').
    replace(/\÷\+/, '+').
    replace(/\-\*/, '*').
    replace(/\-\÷/, '÷').
    replace(/\*\÷/, '÷').
    replace(/\÷\*/, '*').
    replace(/(^0)([^\.|^\+|^\-|^\*|^\/|^\÷]+)/, '$2').
    replace(/\.{2,}/, '\.').
    replace(/(.*)(\.)(\d*)(\.)(.*)/, '$1$2$3$5');
    return newVal;
  }

  handleChange(e) {
    const val = this.removeInvalidChars(e.target.value);
    this.setState({ value: val });
  }

  handleClick(e) {
    ['clear', 'equals'].includes(e.currentTarget.id) == false ?
    this.setState({ value: this.removeInvalidChars(this.state.value + ID_MAP[e.currentTarget.id]) }) :
    e.currentTarget.id == 'clear' ?
    this.setState({ value: '0' }) :
    //print to console for now
    this.calculate(this.state.value);
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "container" }, /*#__PURE__*/
      React.createElement(Box, {
        sx: {
          flexGrow: 1,
          width: '280px',
          margin: '25px' } }, /*#__PURE__*/


      React.createElement(TextField, {
        fullWidth: true,
        id: "display",
        variant: "outlined",
        margin: "normal",
        value: this.state.value,
        onChange: this.handleChange }), /*#__PURE__*/

      React.createElement(Grid, {
        container: true,
        spacing: 1,
        direction: "row-reverse" },

      ['÷', 9, 8, 7, '*', 6, 5, 4, '-', 3, 2, 1, '+', '=', '.', 0, 'CLR'].map((val, index) => /*#__PURE__*/
      React.createElement(Grid, {
        item: true,
        key: index }, /*#__PURE__*/

      React.createElement(Button, {
        color: "primary",
        variant: "outlined",
        onClick: this.handleClick,
        id: ['divide', 'nine', 'eight', 'seven', 'multiply', 'six', 'five', 'four', 'subtract', 'three', 'two', 'one', 'add', 'equals', 'decimal', 'zero', 'clear'][index] }, /*#__PURE__*/

      React.createElement("b", null, val))))))));








  }}
;

ReactDOM.render( /*#__PURE__*/
React.createElement(Presentational, null),
document.getElementById('app'));