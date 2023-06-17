var defaultMarkup = '# Set a title  \n## Give it a subtitle \nAnd write your text. If necessary, add a link to [Twitter](https://twitter.com/) as well.\nExplain how to set a variable like such `let myVar = 1` and leave it inline.\n\nBut maybe your code snippet is a bit longer. You could put it in a block like this: \n    if(true){\n      print(true)\n    }\n    else {\n      print(false)\n    }\n<!-- block -->\nMake a list:\n-  List Item 1\n-  List Item 2\n**Make your text bold or insert an image of a panda**\n\n![This is an image](https://i.imgur.com/jbwx4KP.gif )\n> Block Start > Block Mid>Block End'
class Presentational extends React.Component {
  constructor(props) {
    super(props);
    this.getMarkup = this.getMarkup.bind(this);
    this.parseHTML = this.parseHTML.bind(this);
    this.state = {
      text: this.getMarkup(defaultMarkup)
    };
    this.handleChange = this.handleChange.bind(this);

  }
    
  parseHTML(markupText) {
    return ( 
      <div id="preview" className='outline' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(markupText)}} />
    )
  }
  
  getMarkup(rawText) {
    let replacement = marked.parse(rawText);
    return this.parseHTML(replacement);
    /* Some Parsing that I made that is apparently unnecessary
    function replacer(match) {
      let replacement = match.replace(/</g, '&lt;');
      replacement = replacement.replace(/>/g, '&gt;');
    return replacement;
    }
    
    let markupText = rawText.replace(/<|>/g, replacer)
      .replace(/\/begin\{bold\}\/begin\{red\}/g, '\/begin\{red\}\/begin\{bold\}')
      .replace(/\/end\{red\}\/end\{bold\}/g, '\/end\{bold\}\/end\{red\}')
      .replace(/\/begin\{it\}\/begin\{red\}/g, '\/begin\{red\}\/begin\{it\}')
      .replace(/\/end\{red\}\/end\{it\}/g, '\/end\{it\}\/end\{red\}')
      .replace(/(?:\/begin\{it\})([^\}]*)(?:\/end\{it\})/g, '<em>$1</em>')
      .replace(/(?:\/begin\{bold\})([^\}]*)(?:\/end\{bold\})/g, '<b>$1</b>')
      .replace(/\n/g, '')
      .replace(/(?<!\/\{)(\\\\)(?!\})/g, '<br>')
      .replace(/(?:\/\{)(.{1,2})(?:\})/g, '$1')
      .replace(/(?:\/begin\{red\})([^\}]*)(?:\/end\{red\})/g,"<span style='color:red'>$1</span>")
      .replace(/\\t/g, '&emsp;')
      .replace(/(?:\/begin\{center\})(.*)(?:\/end\{center\})/g, "<p style='text-align:center'>$1</p>")
      .replace(/(?:\/begin\{right\})(.*)(?:\/end\{right\})/g, "<p style='text-align:right'>$1</p>")
      .replace(/(?:\/begin\{html\})(.*)(?:\/end\{html\})/g, "<p style='background: #BDBDBD; border:1px solid black; box-shadow: -1px 1px 5px 3px black;'>$1</p>");
    console.log(markupText);
    return this.parseHTML('<p>' + markupText + '</p>');
    */
  }
  
  handleChange(event) {
    this.setState({
      text: this.getMarkup(event.target.value)
    });
  }

  render() {
    return (
      <div id="container">
        <textarea id="editor"
          className='outline'
          onChange={this.handleChange}>
          {defaultMarkup}
        </textarea>
        {this.state.text}
      </div>
    );
  }
}

ReactDOM.render(<Presentational />, document.getElementById("app"));