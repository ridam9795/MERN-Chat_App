import './App.css';
import Homepage from './Pages/Homepage';
import {Route} from 'react-router-dom';
import Chatpage from './Pages/Chatpage';
import EmailVerify from './components/EmailVerify';
import TagManager from 'react-gtm-module'

  const tagManagerArgs = {
  gtmId: 'GTM-NCHJ4VL'
}
TagManager.initialize(tagManagerArgs)
function App() {
  window.dataLayer.push({
    event: 'pageview'
  });

  return (
    <div className="App">
       <Route path="/" component={Homepage} exact>

     </Route>
  
      <Route path="/chats" component={Chatpage}>

      </Route>
      <Route path="/api/user/:id/verify/:token" component={EmailVerify}>

      </Route>
    
    </div>
  );
}

export default App;
