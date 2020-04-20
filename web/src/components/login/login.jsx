import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import { login, getUserInfo } from 'actions/userActions';
import './login.css';
import icon from '../../images/ml_reef_icon_01.svg';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasErrors: false,
      email: '',
      password: '',
    };

    this.submit = this.submit.bind(this);
    this.reset = this.reset.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { isAuth, history } = this.props;

    if (isAuth) history.push('/my-projects');
  }

  componentDidUpdate() {
    const { isAuth, history } = this.props;

    if (isAuth) history.push('/my-projects');
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  validateForm() {
    const { email } = this.state;
    const { password } = this.state;
    return email.length > 0
      && password.length > 0;
  }

  submit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const { email } = this.state;
    const { password } = this.state;

    const { actions } = this.props;

    const formData = {
      username: email,
      email,
      password,
    };

    actions.login(formData)
      .then(() => {
        toastr.success('Success:', 'Login successfully');
        return actions.getUserInfo()
          .catch(() => {
            toastr.warning('Connection problem:', 'Failed to fetch user information.');
          });
      })
      .catch((error) => {
        toastr.error('Error:', `Try Login with mlreef + password or get: ${error}`);
        this.setState({ hasErrors: true });
      });
  }

  reset() {
    this.setState({
      email: '',
      password: '',
      hasErrors: false,
    });
  }

  render() {
    const {
      email,
      password,
      hasErrors,
    } = this.state;

    return (
      <div id="login-container">
        <div id="icon-div">
          <img className="mx-auto mb-2" src={icon} alt="" />
        </div>
        <div id="errorDiv" className={`${!hasErrors? 'invisible' : ''} error border-div d-flex py-2`}>
          <p className="my-auto flex-1">Incorrect username or password</p>
          <div className="flex-0">
            <button className="btn btn-basic-dark btn-sm my-auto" type="button" onClick={this.reset}>
              Reset
            </button>
          </div>
        </div>
        <div className="login-form border-div">
          <div className="title">
            Sign in to
            {' '}
            <b>MLreef</b>
          </div>
          <form onSubmit={this.submit}>
            <div className="form-container">
              <div className="input-container paragraph">
                <p>Username or email address</p>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={this.handleChange}
                />
              </div>
              <div className="input-container paragraph">
                <p>Password</p>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={this.handleChange}
                />
              </div>

              <div id="sign-in-btn" className="input-container">
                <button type="submit" className="btn btn-primary">
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>
        <div id="create-account-div" className="border-div paragraph">
          <p>
            New to MLreef?
            {' '}
            <Link to="/register">
              <b>Create an account.</b>
            </Link>
          </p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuth: state.user && state.user.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      login,
      getUserInfo,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
