import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainMenu from './components/sharedComponents/MainMenu';
import UserMenu from './components/sharedComponents/UserMenu';
import Login from './components/sharedComponents/Login'

function App() {
  let isLoggedIn = false;
  return (
    <div className="App">
      <div>
        <MainMenu />
        <UserMenu />
      </div>
      <Login />
    </div>
  );
}

export default App;
