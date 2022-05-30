import {
  Links,
  LiveReload,
  Form,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
  useLoaderData,
} from "@remix-run/react";
import styles from "~/tailwind.css";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { getSession } from "~/sessions.server.js";

export async function loader({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const profile = await db.models.Profile.findOne({
    userId: session.get("userId"),
  });
  const hasProfile = await db.models.Profile.findOne({
    userId: session.get("userId"),
  });
  return json({
    profileId: profile ? profile._id : null,
    hasProfile: hasProfile ? true : false,
  });
}

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Student job portal",
    viewport: "width=device-width,initial-scale=1",
  };
}

export default function App() {
  const { profileId, hasProfile } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="font-sans">
        <header className="bg-gradient-to-br from-indigo-900 to-blue-700 text-white w-full">
          <div className="py-2 px-4">
            <Form
              method="post"
              action="/logout"
              className="px-2 pt-2 pb-1 w-11 m-2 mb-4 float-left border-white rounded-md border-2 border-dashed hover:border-solid"
            >
              <button type="submit">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </Form>
            <MenuLink
              to="/"
              className="p-2 w-11 my-2 mr-4 float-left border-white rounded-md border-2 border-dashed hover:border-solid"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </MenuLink>
            <MenuLink to="/" className="inline float-left py-3">
              <h1 className="text-xl mt-1.5 font-bold text-center">
                Student job portal
              </h1>
            </MenuLink>
            {profileId !== null && (
              <MenuLink
                to={`/profiles/${profileId}`}
                className="p-2 w-11 m-2 mb-4 float-right border-white text-white rounded-md border-2 border-dashed hover:border-solid"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </MenuLink>
            )}
            {hasProfile && (
              <MenuLink
                to={`/profiles/update/${profileId}`}
                className="p-2 w-11 m-2 mb-4 float-right border-white text-white rounded-md border-2 border-dashed hover:border-solid"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </MenuLink>
            )}
            {!hasProfile && (
              <MenuLink
                to="/profiles/new"
                className="p-2 w-11 m-2 mb-4 float-right border-white rounded-md border-2 border-dashed hover:border-solid"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </MenuLink>
            )}
          </div>
          <div class="clear-both"></div>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function MenuLink({ to, className, children }) {
  return (
    <NavLink
      end
      to={to}
      className={({ isActive }) =>
        [className, "text-white", isActive && "font-bold"]
          .filter(Boolean)
          .join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
