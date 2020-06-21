import React, { useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import AuthPage from './components/auth-page';
import LoginPage from './components/login-page';
import SignUpPage from './components/signup-page';
import Context from './context/context';

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const routes: React.ReactNode = (
    <Switch>
      <Route path="/auth">
        <AuthPage />
      </Route>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/signup">
        <SignUpPage />
      </Route>
      <Route exact path="/" />
      <Redirect to="/" />
    </Switch>
  );

  function authorize() {
    if (!isAuthorized) {
      setIsAuthorized(!isAuthorized);
    }
  }

  return (
    <Router>
      <Context.Provider value={{ authorize }}>
        <div className="app">
          <header className="app-header">
            <Link to="/auth"><h1>RS LANG</h1></Link>
          </header>
          <main className="app-main">
            {routes}
          </main>
        </div>
      </Context.Provider>
    </Router>

  );
}

export default App;
