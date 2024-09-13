import { createBrowserRouter } from "react-router-dom";

import Container from "../Pages/Container/Container";
import SignIn from "../Pages/Authentication/SignIn/SignIn";

import ErrorPage from "../Pages/Error/ErrorPage";

import MessageContainer from "../Pages/Assistant/MessageContainer";

import AOF from "../Pages/AOF/AOF";

import PC1Container from "../Pages/PC1Gen/PC1Container"

import MinsContainer from "../Pages/MinsGen/MinsContainer";

import EmailsContainer from "../Pages/Emails/EmailsContainer";

import Protected from "../utils/Protected";

const router = createBrowserRouter([

  {
    element: <Protected />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Container />,
        children: [
          {
            path: "/",
            element: <MessageContainer />,
          },
          {
            path: "/Assistant",
            element: <MessageContainer />,
          },

          {
            path: "/Minutes of Meeting",
            element: <MinsContainer />
          },

          {
            path: "/pc1",
            element: <PC1Container />
          },
          {
            path: "/Authorization of Funds",
            element: <AOF />
          },

          {
            path: "/Meeting Scheduling",
            element: <EmailsContainer />,
          },
        ]
      },

    ]
  },
  {
    path: "/Sign-In",
    element: <SignIn />
  }


]);

export default router;
