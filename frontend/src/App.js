import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TravelProvider } from "./context/TravelContext";
import { Toaster } from "./components/ui/sonner";

// Pages
import HomePage from "./pages/HomePage";
import DestinationPage from "./pages/DestinationPage";
import PlaceDetailsPage from "./pages/PlaceDetailsPage";
import MapPage from "./pages/MapPage";
import ChatPage from "./pages/ChatPage";
import SavedPage from "./pages/SavedPage";

function App() {
  return (
    <TravelProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/destination/:id" element={<DestinationPage />} />
            <Route path="/destination/:destinationId/place/:placeId" element={<PlaceDetailsPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/saved" element={<SavedPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </TravelProvider>
  );
}

export default App;
