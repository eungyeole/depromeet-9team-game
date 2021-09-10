import { Global } from '@emotion/react'
import { globalStyle } from './styles/globalStyle';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import styled from '@emotion/styled';
import RoomPage from './pages/RoomPage';
function App() {
  return (
    <Layout>
      <Global styles={globalStyle}></Global>
      <Router>
        <Route path="/room/:code/:name" component={RoomPage} exact></Route>
        <Route path="/" component={MainPage} exact></Route> 
      </Router> 
    </Layout>
  );
}

export default App;

const Layout = styled.div`
  margin: 0 auto;
  max-width: 512px;
  width: 100%;
  height: 100vh;
  padding: 0 30px;
  position: relative;
`