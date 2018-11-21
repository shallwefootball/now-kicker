import { Component } from 'react';

class App extends Component {
  componentDidMount() {
    window.location.href = this.props.redirectPath;
  }
  render() {
    return <h1>redirecting...</h1>;
  }
}

App.getInitialProps = ({ query: { redirectPath } }) => {
  return { redirectPath };
};

export default App;
