import { useLoaderData, useCatch, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "../../sessions.server";

export async function action({ request, params }) {
  const form = await request.formData();
  const action = form.get("_action");
  const db = await connectDb();

  if (action === "delete") {
    try {
      await db.models.Profile.findByIdAndDelete(params.profileId);
      return redirect(`/`);
    } catch (error) {
      return json(
        { errors: error.errors, values: Object.fromEntries(form) },
        { status: 400 }
      );
    }
  } else if (action === "like") {
    const profile = await db.models.Profile.findById(params.profileId);
    profile.like = !profile.like;
    await profile.save();
  }
  return null;
}

export async function loader({ params, request }) {
  const db = await connectDb();
  const profile = await db.models.Profile.findById(params.profileId);
  if (!profile) {
    throw new Response(`Couldn't find profile with id ${params.profileId}`, {
      status: 404,
    });
  }
  const session = await requireUserSession(request);
  const userId = session.get("userId");
  const verifyUser = userId == profile.userId;
  if (!verifyUser) {
    throw new Response(
      `This profile doesnt belong to you :) ${params.profileId}`,
      {
        status: 403,
      }
    );
  } else {
    return json(profile);
  }
}

function avatarImg(name) {
  return `https://avatars.dicebear.com/api/micah/${name}.svg?mood[]=happy&background=%23e8e8e8`;
}

export default function ProfilePage() {
  const profile = useLoaderData();
  return (
    <div className="grid grid-cols-4 leading-6 text-slate-800 text-sm">
      <div className="clear-both h-screen pt-36"></div>
      <div className="col-span-2 mb-5 py-10 px-6">
        <Form method="post">
          <button
            type="submit"
            name="_action"
            value="like"
            className="float-right clear-both"
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
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
              {profile.like ? "Unlike" : "like"}
            </svg>
          </button>
        </Form>
        <img
          className="w-1/3 float-left inline rounded-lg"
          src={avatarImg(profile.fullName)}
          alt="avatar"
        />
        <h1 className="text-3xl font-bold text-black float-left px-6 pb-6 pt-2">
          {profile.title}
        </h1>

        <div className="float-left inline w-4/6">
          <p className="font-bold pt-4 pl-6">Name</p>
          <p className="ml-6 items-center p-2 border-b border-slate-300 leading-tight">
            {profile.fullName}
          </p>
        </div>
        <div className="float-left inline w-4/6">
          <p className="font-bold pt-6 pl-6">My skills</p>
          <p className="ml-6 items-center p-2 border-b border-slate-300 leading-tight">
            {profile.tags}
          </p>
        </div>
        <div class="clear-both"></div>
        <p className="font-bold p-4 mt-2">About me</p>
        <p className="ml-6 flex items-center p-2 border-b border-slate-300 leading-tight">
          {profile.bio}
        </p>
        <div className="">
          <div className="float-left w-1/3 my-2">
            <p className="font-bold p-4">Link to Linkdin</p>
            <p className="ml-6 flex items-center p-2 leading-tight">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <a href={profile.linkLinkdIn}>{profile.linkLinkdIn}</a>
            </p>
          </div>
          <div className="float-left w-1/3 my-2">
            <p className="font-bold p-4">Link to my portfolio</p>
            <p className="ml-6 flex items-center p-2 leading-tight">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <a href={profile.linkPortfolio}>{profile.linkPortfolio}</a>
            </p>
          </div>
        </div>

        <div class="clear-both"></div>
        <div className="clear-both grid grid-cols-3 mt-8">
          <Link
            to={`/profiles/update/${profile._id}`}
            className="col-span-2 mr-2 rounded-sm bg-indigo-800 hover:bg-gradient-to-br from-indigo-800 to-blue-700 text-white py-2 px-4 border border-slate-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 inline-block"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <p className="inline float-none pl-2">Edit</p>
          </Link>
          <Form method="post">
            <input type="hidden" name="id" value={profile._id} />
            <button
              type="submit"
              name="_action"
              value="delete"
              className="bg-transparent hover:bg-red-500 text-red-500 hover:text-white py-2 px-4 border border-red-500 hover:border-transparent"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}
