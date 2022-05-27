import React from 'react';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter} from "react-router-dom";
import ChatProvider from '../src/Context/ChatProvider'
import { createRoot } from 'react-dom/client';
import TagManager from 'react-gtm-module'

const tagManagerArgs = {
    gtmId: 'GTM-NCHJ4VL'
}

TagManager.initialize(tagManagerArgs)
const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
         <BrowserRouter>

    <ChatProvider>
     <ChakraProvider>
     <App />
     </ChakraProvider>
      

</ChatProvider>
   </BrowserRouter>);


// ReactDOM.render(
//   <ChatProvider>
//     <BrowserRouter>
//     <ChakraProvider>
//     <App />
//     </ChakraProvider>
//         </BrowserRouter>

//   </ChatProvider>,
//   document.getElementById('root')
// );

