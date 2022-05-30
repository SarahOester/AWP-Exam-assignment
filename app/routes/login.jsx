import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { getSession, commitSession } from "~/sessions.server.js";
import connectDb from "~/db/connectDb.server.js";

export async function action({ params, request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const db = await connectDb();
  const form = await request.formData();

  const user = await db.models.User.findOne({
    username: form.get("username").trim(),
  });

  let isCorrectPassword = false;

  if (user) {
    isCorrectPassword = await bcrypt.compare(
      form.get("password").trim(),
      user.password
    );
  }

  if (user && isCorrectPassword) {
    session.set("userId", user._id);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    return json(
      { errorMessage: "User was not found or password didn't match" },
      { status: 401 }
    );
  }
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    userId: session.get("userId"),
  });
}

export default function Login() {
  const { userId } = useLoaderData();
  const actionData = useActionData();

  if (userId) {
    return (
      <div className="grid grid-cols-4 leading-6 text-slate-800 text-sm">
        <div className="clear-both h-screen pt-36"></div>
        <div className="col-span-2 mb-5 py-10 px-6">
          <p>You are already logged in. Your user id is: {userId}.</p>

          <Form method="post" action="/logout">
            <button type="submit" className="my-3 p-2 border rounded">
              Logout
            </button>
          </Form>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-4 leading-6 text-slate-800 text-sm bg-gradient-to-br from-indigo-300 to-blue-200">
      <div className="clear-both h-screen pt-36"></div>
      <div className="col-span-2 py-10 px-28 bg-white shadow-md rounded my-8">
        <h2 className="text-2xl font-bold mb-8">Log in</h2>
        {actionData?.errorMessage ? (
          <p className="text-red-500 font-bold my-3">
            {actionData.errorMessage}
          </p>
        ) : null}
        <Form method="post" className="text-inherit">
          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="title" className="block font-semibold mb-1">
              <p className="font-bold text-slate-500">Username</p>
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Add your e-mail"
              className="ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="title" className="block font-semibold mb-1">
              <p className="font-bold text-slate-500">Password</p>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Should be min 8 characters long"
              className="ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex flex-row items-center gap-3">
            <button
              type="submit"
              className="mt-4 w-1/3 text-sm rounded-sm bg-indigo-800 hover:bg-gradient-to-br from-indigo-800 to-blue-700 text-white py-2 px-8 border border-slate-600"
            >
              Log in
            </button>
            <span className="italic pt-4 px-2">or</span>
            <Link to="/register" className="underline pt-4">
              Sign up
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
