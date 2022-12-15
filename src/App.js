import './App.scss';
import Column from './components/Column';

function App() {
  return (
    <div className="trelloApp">
      <nav className='navbar app' >Nav Bar</nav>
      <nav className='navbar board'>Board Bar</nav>
      <Column />
    </div>
  );
}

export default App;
