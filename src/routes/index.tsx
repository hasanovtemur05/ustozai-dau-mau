import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
  } from "react-router-dom";
  
  import App from "../App";
  // import { HomePage } from "../modules"; 

  const Index = () => {
    const router = createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<App />}>
          {/* <Route path="" element={<HomePage/>} */}
        </Route>
      )
    );
  
    return <RouterProvider router={router} />;
  };
  
  export default Index;
  