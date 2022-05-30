import { useLoaderData, Form, useSearchParams } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ request }) {
  const db = await connectDb();
  const url = new URL(request.url);
  const sort = url.searchParams.get("sort");
  const query = url.searchParams.get("query");
  const profiles = await db.models.Profile.find(
    query
      ? {
          $or: [
            { title: { $regex: new RegExp(query, "i") } },
            { fullName: { $regex: new RegExp(query, "i") } },
            { tags: { $elemMatch: { $regex: new RegExp(query, "i") } } },
          ],
        }
      : {}
  ).sort({
    [sort]: 1,
  });
  return profiles;
}

function avatarImg(name) {
  return `https://avatars.dicebear.com/api/micah/${name}.svg?mood[]=happy&mood[]=happy&background=%23e8e8e8`;
}

export default function Index() {
  const profiles = useLoaderData();
  const [searchParams] = useSearchParams();

  return (
    <div className="grid md:grid-cols-4 grid-cols-3">
      <div className="bg-slate-100">
        <Form className="group relative" method="GET">
          <svg
            width="20"
            height="20"
            fill="currentColor"
            className="absolute left-4 top-7 -mt-2.5 text-white pointer-events-none group-focus-within:text-white"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            />
          </svg>
          <input
            className="w-full focus:outline-none appearance-none text-sm leading-6 bg-gradient-to-br from-indigo-400 to-blue-300 text-white placeholder-white py-4 pl-12 pr-4"
            type="text"
            name="query"
            aria-label="Filter projects"
            placeholder="Filter projects..."
            defaultValue={searchParams.get("query")}
          />

          <div className="text-white">
            <p className="p-4 pt-8 font-bold uppercase text-xs text-black">
              Sort by
            </p>
            <ul>
              <li>
                <button
                  name="sort"
                  value="title"
                  className="pl-4 text-sm text-black hover:text-indigo-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 float-left"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="float-right pl-2">Title</p>
                </button>
              </li>
              <li>
                <button
                  name="sort"
                  value="updatedAt"
                  className="pl-4 pt-4 text-sm text-black hover:text-indigo-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 float-left"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <p className="float-right pl-2">Updated</p>
                </button>
              </li>
              <li>
                <button
                  name="sort"
                  value="like"
                  className="pl-4 pt-4 text-sm text-black hover:text-indigo-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 float-left"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <p className="float-right pl-2">Like</p>
                </button>
              </li>
            </ul>
          </div>
        </Form>
      </div>

      <div className="col-span-2 mb-5 list-none pl-0 text-slate-800">
        <h1 className="text-3xl font-bold text-slate-800 m-8">
          Welcome {profiles.fullName}
        </h1>
        <p className="text-slate-800 mx-8">List of available candidates</p>

        {profiles.map((profile) => {
          const createdAt = new Date(profile.createdAt).toLocaleDateString(
            "da-DK",
            {
              dateStyle: "long",
            }
          );
          return (
            <div className="clear-both m-8 pt-4 text-sm" key={profile._id}>
              <div class="">
                <details
                  class="closed:bg-white dark:closed:bg-slate-100 open:bg-slate-100 closed:ring-1 closed:ring-black/5 closed:shadow-sm p-6 rounded-sm"
                  closed
                >
                  <summary class="float-left inline pr-4 text-sm leading-6 text-slate-900 font-semibold select-none">
                    <div className="pb-4 pr-4 float-left inline">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <Form method="post" className="float-right">
                      <button type="submit" name="_action" value="like">
                        {profile.like ? "Unlike" : "Like"}
                      </button>
                    </Form>
                    <img
                      className="w-1/5 float-left rounded-sm"
                      src={avatarImg(profile.fullName)}
                      alt="avatar"
                    />
                    <div className="float-left pl-6 pt-1 pb-4 border-b border-slate-200">
                      <h1 className="font-semibold">{profile.title}</h1>
                      <p className="font-light">{profile.fullName}</p>
                      <p className="font-light">{profile.tags}</p>
                      <p className="font-light">{createdAt}</p>
                    </div>
                  </summary>
                  <div class="mt-3 text-sm leading-6 text-slate-800 dark:text-slate-800">
                    <p className="clear-both font-light pt-4">{profile.bio}</p>
                  </div>
                </details>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
