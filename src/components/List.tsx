import { useEffect, useState } from "react";
import { Keyword } from "../types/keywords";
import { IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { DotPulse } from "@uiball/loaders";

export function List() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  const { isLoading, data, error } = useQuery({
    queryKey: ["listKeywords"],
    queryFn: () =>
      chrome.cookies
        .get({ url: "https://twitter.com", name: "ct0" })
        .then(async (response) => {
          const csrf_token = response?.value;
          const result = await chrome.storage.local.get("bearer");
          try {
            const r = await getKeywordsList(result.bearer, csrf_token);
            const result_2 = await r.json();
            return result_2.muted_keywords as Array<Keyword>;
          } catch (err) {
            return console.error(err);
          }
        }),
  });

  useEffect(() => {
    setKeywords(data as Keyword[]);
  }, [data]);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <DotPulse size={40} speed={1} color="black" />
      </div>
    );

  if (error instanceof Error)
    return (
      <div>
        <p className="mt-10 text-center dark:text-white">
          An error has occurred: {error.message}
        </p>
      </div>
    );

  return (
    <ul className="list-none space-y-2 text-slate-900 dark:text-white">
      {keywords?.map((item) => (
        <li key={item.id} className="group flex items-center justify-end">
          <div className="mr-2 truncate group-hover:font-bold group-hover:italic">
            {item.keyword}
          </div>
          <button
            className="rounded-full hover:bg-gray-200 dark:hover:bg-slate-500"
            onClick={() => {
              chrome.storage.local.get("options", function (result) {
                if (result.options.debug) {
                  console.debug("clicked on remove word button");
                }
              });
              removeWord(item.id as string);
              setKeywords(keywords.filter((obj) => obj.id !== item.id));
            }}
          >
            <IconTrash size={20} strokeWidth={1} />
            {/* <IconX size={20} strokeWidth={1} /> */}
          </button>
        </li>
      ))}
    </ul>
  );
}

function getKeywordsList(bearerToken: string, csrfToken: string | undefined) {
  const headers = new Headers();
  headers.append("authorization", `Bearer ${bearerToken}`);
  headers.append("content-type", "application/x-www-form-urlencoded");
  headers.append("x-csrf-token", csrfToken || "");
  headers.append("x-twitter-active-user", "yes");
  headers.append("x-twitter-auth-type", "OAuth2Session");
  headers.append("x-twitter-client-language", "en");

  return fetch("https://twitter.com/i/api/1.1/mutes/keywords/list.json", {
    headers: headers,
    method: "GET",
  });
}

// removeWord authenticates and destroys the provided keyword by ID.
function removeWord(id: string) {
  chrome.cookies.get(
    { url: "https://twitter.com", name: "ct0" },
    (response) => {
      const csrf_token = response?.value;

      chrome.storage.local.get("bearer", function (result) {
        destroyKeyword(id, result.bearer, csrf_token as string)
          .then((res) => {
            chrome.storage.local.get("options", function (result) {
              if (result.options.debug) {
                console.log(res);
              }
            });
          })
          .catch((err) => console.error(err));
      });
    },
  );
}

function destroyKeyword(id: string, bearerToken: string, csrfToken: string) {
  return fetch("https://twitter.com/i/api/1.1/mutes/keywords/destroy.json", {
    headers: {
      authorization: `Bearer ${bearerToken}`,
      "content-type": "application/x-www-form-urlencoded",
      "x-csrf-token": csrfToken,
      "x-twitter-active-user": "yes",
      "x-twitter-auth-type": "OAuth2Session",
      "x-twitter-client-language": "en",
    },

    body: `ids=${id}`,
    method: "POST",
  });
}
