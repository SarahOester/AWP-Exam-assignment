import { Form, useActionData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "../../sessions.server";

export async function loader({ request }) {
  await requireUserSession(request);
  return null;
}

export async function action({ request }) {
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const form = await request.formData();
  const db = await connectDb();
  try {
    const hasProfile = await db.models.Profile.findOne({
      userId: userId,
    });

    if (hasProfile !== null)
      return json(
        { errors: { hasProfile: "You already created a profile!" } },
        { status: 400 }
      );
    const newProfile = await db.models.Profile.create({
      title: form.get("title"),
      fullName: form.get("fullName"),
      bio: form.get("bio"),
      tags: form.get("tags"),
      linkLinkdIn: form.get("linkLinkdIn"),
      linkPortfolio: form.get("linkPortfolio"),
      userId: userId,
    });
    return redirect(`/profiles/${newProfile._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function CreateProfile() {
  const actionData = useActionData();
  console.log(actionData?.errors.title);
  return (
    <div className="grid grid-cols-4 leading-6 text-slate-800 text-sm">
      <div className="clear-both h-screen pt-36"></div>
      <div className="col-span-2 mb-5 py-10 px-6">
        <h1 className="text-2xl font-bold mb-4">Create profile</h1>
        <Form method="post">
          {actionData?.errors.hasProfile && (
            <p className="text-red-500 mt-1 mb-0 py-4">
              {actionData.errors.hasProfile}
            </p>
          )}

          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="title" className="block font-semibold mb-1">
              <p className="font-bold text-slate-500">Title</p>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Enter your title"
              defaultValue={actionData?.values?.title}
              className={[
                "ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline",
                actionData?.errors.title && "border-2 border-red-500",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </div>
          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="fullName" className="block font-semibold mb-1">
              <p className="font-bold text-slate-500">Name</p>
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Enter your full name"
              defaultValue={actionData?.values?.fullName}
              className={[
                "ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline",
                actionData?.errors.fullName && "border-2 border-red-500",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </div>
          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="bio" className="block font-semibold mb-1">
              <p className="font-bold text-slate-500">About me</p>
            </label>
            <textarea
              rows="8"
              name="bio"
              id="bio"
              placeholder="Tell us something about you"
              defaultValue={actionData?.values?.bio}
              className={[
                "bg-slate-50 ml-4 flex items-center p-2 leading-tight focus:bg-slate-100 focus:outline-none focus:shadow-outline",
                actionData?.errors.bio && "border-2 border-red-500",
              ]
                .filter(Boolean)
                .join(" ")}
            ></textarea>
          </div>
          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="tags" className="block font-semibold mb-1">
              <p className="font-bold text-slate-500">My skills</p>
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              placeholder="What are your professional skills"
              defaultValue={actionData?.values?.tags}
              className={[
                "ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline",
                actionData?.errors.tags && "border-2 border-red-500",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </div>
          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="linkLinkdIn" className="block font-semibold mb-1">
              <p className="font-bold text-slate-500">Link to LinkdIn</p>
            </label>
            <input
              type="text"
              name="linkLinkdIn"
              id="linkLinkdIn"
              placeholder="Insert a link to your LinkdIn profile"
              defaultValue={actionData?.values?.linkLinkdIn}
              className={[
                "ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline",
                actionData?.errors.linkLinkdIn && "border-2 border-red-500",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </div>
          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="linkPortfolio" className="block font-semibold mb-1">
              <p className="font-bold text-slate-500">Link to my Portfolio</p>
            </label>
            <input
              type="text"
              name="linkPortfolio"
              id="linkPortfolio"
              placeholder="Insert a link to your portfolio"
              defaultValue={actionData?.values?.linkPortfolio}
              className={[
                "ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline",
                actionData?.errors.linkPortfolio && "border-2 border-red-500",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </div>
          {actionData?.errors.title && (
            <p className="text-red-500 mt-1 mb-0 py-4">
              {actionData.errors.title.message}
            </p>
          )}
          <button
            type="submit"
            className="mt-4 w-1/3 text-sm rounded-sm bg-indigo-800 hover:bg-gradient-to-br from-indigo-800 to-blue-700 text-white py-2 px-8 border border-slate-600"
          >
            Save
          </button>
        </Form>
      </div>
    </div>
  );
}
