import { useState } from "react";
import {
  ChakraProvider,
  DarkMode,
  useColorMode,
  extendTheme,
} from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

// Import CSS
import "./App.css";

// Import Components
import Navbar from "./pages/Navbar";
import Block from "./pages/Block";
import Prices from "./pages/Prices";
import Stake from "./pages/Stake";
import Send from "./pages/Send";
import History from "./pages/History";
import { theme } from "./styles/theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/stake" element={<Stake />}></Route>
        <Route path="/price" element={<Prices />}></Route>
        <Route path="/block" element={<Block />}></Route>
        <Route path="/send" element={<Send />}></Route>
        <Route path="/transactions" element={<History />}></Route>
        <Route path="/" element={<Stake />}></Route>
      </Routes>
    </ChakraProvider>
  );
}

export default App;
