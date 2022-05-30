import { Form, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { redirect } from "@remix-run/node";
import seedUsersData from "~/db/userSeed.json";
import seedProfilesData from "~/db/profileSeed.json";

export async function loader() {
  const db = await connectDb();
  const count = await db.models.Profile.countDocuments();
  if (count > 0) {
    return redirect("/");
  }
  return null;
}

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  const _action = form.get("_action");

  if (_action === "seed") {
    try {
      await db.models.Profile.insertMany(seedProfilesData);
      await db.models.User.insertMany(seedUsersData);
      return redirect("/");
    } catch (error) {
      throw error;
    }
  }
}

export default function Seed() {
  return (
    <>
      <div className="grid grid-cols-4 leading-6 text-slate-800 text-sm">
        <div className="clear-both h-screen pt-36"></div>
        <div className="col-span-2 py-10 px-28 bg-white shadow-lg rounded my-8">
          <h2 className="text-2xl font-bold mb-8">
            Your database is empty, would you like it to be seeded?
          </h2>
          <div className="flex flex-row items-center gap-3">
            <Form method="post">
              <button
                name="_action"
                value="seed"
                type="submit"
                className="mt-4 text-sm rounded-sm bg-red-600 hover:bg-red-700 text-white py-2 px-8"
              >
                Yes please
              </button>
              <Link to="/">
                <button className="underline pt-4 px-6">No!</button>
              </Link>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
