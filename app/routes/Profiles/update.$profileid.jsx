import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server";

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  const id = form.get("id");

  try {
    await db.models.Profile.findByIdAndUpdate(id, {
      title: form.get("title"),
      fullName: form.get("fullName"),
      bio: form.get("bio"),
      tags: form.get("tags"),
      linkLinkdIn: form.get("linkLinkdIn"),
      linkPortfolio: form.get("linkPortfolio"),
    });
    return redirect(`/profiles/${id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export async function loader({ params }) {
  const db = await connectDb();
  const profiles = await db.models.Profile.findById(params.profileid);
  return profiles;
}

export default function CreateProfile() {
  const profile = useLoaderData();
  const actionData = useActionData();

  console.log(profile);
  return (
    <div className="grid grid-cols-4 border-2 border-slate-200 leading-6 text-slate-800 text-sm">
      <div className="clear-both h-screen pt-36"></div>
      <div className="col-span-2 mb-5 py-10 px-6">
        <h1 className="text-2xl font-bold mb-8">{profile?.title}</h1>
        <Form method="post" className="md:flex md:flex-wrap md:justify-between">
          <input type="hidden" name="id" value={profile._id} />
          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="title" className="mb-1 tracking-wide text-sm">
              <p className="font-bold text-slate-300">Title</p>
            </label>
            <input
              type="text"
              name="title"
              defaultValue={profile?.title}
              id="title"
              className={[
                "ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline",
                actionData?.errors.title ? "border-2 border-red-500" : null,
              ]}
            />
          </div>
          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="fullName" className="mb-1 tracking-wide text-sm">
              <p className="font-bold text-slate-300">Name</p>
            </label>
            <input
              type="text"
              name="fullName"
              defaultValue={profile?.fullName}
              id="fullName"
              className={[
                "ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline",
                actionData?.errors.fullName ? "border-2 border-red-500" : null,
              ]}
            />
          </div>
          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="bio" className="mb-1 tracking-wide text-sm">
              <p className="font-bold text-slate-300">About me</p>
            </label>
            <textarea
              rows="8"
              name="bio"
              defaultValue={profile?.bio}
              id="bio"
              className={[
                "ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline",
                actionData?.errors.bio ? "border-2 border-red-500" : null,
              ]}
            ></textarea>
          </div>
          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="tags" className="mb-1 tracking-wide text-sm">
              <p className="font-bold text-slate-300">My skills</p>
            </label>
            <input
              type="textarea"
              name="tags"
              defaultValue={profile?.tags}
              id="tags"
              className={[
                "ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline",
                actionData?.errors.tags ? "border-2 border-red-500" : null,
              ]}
            />
          </div>
          <div class="flex flex-col mb-4 md:w-full">
            <label htmlFor="linkLinkdIn" className="mb-1 tracking-wide text-sm">
              <p className="font-bold text-slate-300">Link to LinkdIn</p>
            </label>
            <input
              type="textarea"
              name="linkLinkdIn"
              defaultValue={profile?.linkLinkdIn}
              id="linkLinkdIn"
              className={[
                "ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline",
                actionData?.errors.linkLinkdIn
                  ? "border-2 border-red-500"
                  : null,
              ]}
            />
          </div>
          <div class="flex flex-col mb-4 md:w-full">
            <label
              htmlFor="linkPortfolio"
              className="mb-1 tracking-wide text-sm"
            >
              <p className="font-bold text-slate-300">Link to my Portfolio</p>
            </label>
            <input
              type="textarea"
              name="linkPortfolio"
              defaultValue={profile?.linkPortfolio}
              id="linkPortfolio"
              className={[
                "ml-4 flex items-center p-2 border-b border-slate-300 leading-tight focus:border-b focus:border-indigo-400 focus:outline-none focus:shadow-outline",
                actionData?.errors.linkPortfolio
                  ? "border-2 border-red-500"
                  : null,
              ]}
            />
          </div>

          {actionData?.errors.title && (
            <p className="text-red-500">{profile.errors.title.message}</p>
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
