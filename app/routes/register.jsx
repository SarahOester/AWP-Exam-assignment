import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { getSession, commitSession } from "~/sessions.server.js";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();

  if (form.get("password").trim() !== form.get("repeatPassword").trim()) {
    return json(
      {
        errorMessage: "Passwords doesnt match",
        values: Object.fromEntries(form),
      },
      { status: 400 }
    );
  }

  if (form.get("password").trim()?.length < 8) {
    return json(
      {
        errorMessage: "At least 8 characters",
        values: Object.fromEntries(form),
      },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(form.get("password").trim(), 10);

  try {
    const user = await db.models.User.create({
      username: form.get("username").trim(),
      password: hashedPassword,
    });
    if (user) {
      session.set("userId", user._id);
      return redirect(`/`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } else {
      return json(
        { errorMessage: "User couldn't be created" },
        { status: 400 }
      );
    }
  } catch (error) {
    return json(
      {
        errorMessage:
          error.message ??
          error.errors?.map((error) => error.message).join(", "),
      },
      { status: 400 }
    );
  }
}

export default function Register() {
  const actionData = useActionData();

  return (
    <div className="grid grid-cols-4 leading-6 text-slate-800 text-sm bg-gradient-to-br from-indigo-300 to-blue-200">
      <div className="clear-both h-screen pt-36"></div>
      <div className="col-span-2 py-10 px-28 bg-white shadow-md rounded my-8">
        <h2 className="text-2xl font-bold mb-8">Create a account</h2>
        <p></p>
        {actionData?.errorMessage ? (
          <p className="text-red-500 font-bold my-3">
            {actionData.errorMessage}
          </p>
        ) : null}
        <Form method="post" className="text-inherit">
          <div class="mb-4 w-full">
            <label htmlFor="title" className="block font-semibold mb-1">
              <p className="font-bold text-slate-500">Username</p>
            </label>
            <Input
              type="text"
              name="username"
              id="username"
              placeholder="Add your e-mail"
              className="ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4 w-full">
            <label htmlFor="title" className="block font-semibold mb-1">
              <p className="font-bold text-slate-500">Passsword</p>
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Should be min 8 characters long"
              className="ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4 w-full">
            <label htmlFor="title" className="block font-semibold mb-1">
              <p className="font-bold text-slate-500">Passsword</p>
            </label>
            <Input
              type="password"
              name="repeatPassword"
              id="repeatPassword"
              placeholder="Repeat password"
              className="ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex flex-row items-center gap-3">
            <button
              type="submit"
              className="mt-4 w-1/3 text-sm rounded-sm bg-indigo-800 hover:bg-gradient-to-br from-indigo-800 to-blue-700 text-white py-2 px-8 border border-slate-600"
            >
              Sign up
            </button>
            <span className="italic pt-4 px-4">or</span>
            <Link to="/login" className="underline pt-4">
              Log in
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

function Input({ ...rest }) {
  return (
    <input
      {...rest}
      className="ml-4 w-full flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline"
    />
  );
}
