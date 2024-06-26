import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../Home";
import Login from "../Login";
import Lobby from "../Lobby";
import Join from "../Join";
import VideoPlayer from "../VideoPlayer";
import NotFoundPage from "../NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/lobby",
    element: <Lobby />,
  },
  {
    path: "/lobby/:roomId",
    element: <Join />,
  },
  {
    path: "/video-player",
    element: <VideoPlayer />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

//   <Router>
//     <Switch>
//       <Route exact path="/" component={Home} />
//       <Route path="/login" component={Login} />
//       <Route exact path="/lobby" component={Lobby} />
//       <Route path="/lobby/:roomId" component={Join} />
//       <Route exact path="/video-player" component={VideoPlayer} />
//       <Route path="*" component={NotFoundPage} />
//     </Switch>
//   </Router>
// );

export default router;
