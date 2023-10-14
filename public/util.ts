type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type InputTag = "input" | "textarea";
type Field = InputTag | { [key: string]: Field };
type Fields = Record<string, Field>;

type operation = {
  name: string;
  endpoint: string;
  method: HttpMethod;
  fields: Fields;
};

const operations: operation[] = [
  {
    name: "Get Session User (logged in user)",
    endpoint: "/api/session",
    method: "GET",
    fields: {},
  },
  {
    name: "Create User",
    endpoint: "/api/users",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Login",
    endpoint: "/api/login",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Logout",
    endpoint: "/api/logout",
    method: "POST",
    fields: {},
  },
  {
    name: "Update User",
    endpoint: "/api/users",
    method: "PATCH",
    fields: { update: { username: "input", password: "input" } },
  },
  {
    name: "Delete User",
    endpoint: "/api/users",
    method: "DELETE",
    fields: {},
  },
  {
    name: "Get Users (empty for all)",
    endpoint: "/api/users/:username",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Get Posts (empty for all)",
    endpoint: "/api/posts",
    method: "GET",
    fields: { author: "input" },
  },
  {
    name: "Create Post",
    endpoint: "/api/posts",
    method: "POST",
    fields: { content: "input" },
  },
  {
    name: "Update Post",
    endpoint: "/api/posts/:id",
    method: "PATCH",
    fields: { id: "input", update: { content: "input", options: { backgroundColor: "input" } } },
  },
  {
    name: "Delete Post",
    endpoint: "/api/posts/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
  {
    name: "Get Friends",
    endpoint: "/api/friends",
    method: "GET",
    fields: { }
  },
  {
    name: "Remove Friend",
    endpoint: "/api/friends/:friend",
    method: "DELETE",
    fields: { friend: "input" }
  },
  {
    name: "Send Friend Request",
    endpoint: "/api/friend/requests/:to",
    method: "POST",
    fields: { to: "input" }
  },
  {
    name: "Remove Friend Request",
    endpoint: "/api/friend/requests/:to",
    method: "DELETE",
    fields: { to: "input" }
  },
  {
    name: "Accept Friend Request",
    endpoint: "/api/friend/accept/:from",
    method: "PUT",
    fields: { from: "input" }
  },
  {
    name: "Reject Friend Request",
    endpoint: "/api/friend/reject/:from",
    method: "PUT",
    fields: { from: "input" }
  },
  {
    name: "Get Friend Requests",
    endpoint: "/api/friend/requests",
    method: "GET",
    fields: { }
  },
  {
    name: "Get Profile",
    endpoint: "/api/profile/:owner",
    method: "GET",
    fields: { owner: "input" }
  },
  {
    name: "Create Profile",
    endpoint: "/api/profile/create",
    method: "POST",
    fields: { name: "input", content: "textarea" }
  },
  {
    name: "Update Profile",
    endpoint: "/api/profile/update/:id",
    method: "PATCH",
    fields: { id: "input", name: "input", content: "textarea" }
  },
  {
    name: "Create Profile View",
    endpoint: "/api/profile/create_view",
    method: "POST",
    fields: { user: "input", name: "input" }
  },
  {
    name: "Change Profile View",
    endpoint: "/api/profile/change_view/:id",
    method: "PATCH",
    fields: { id: "input", name: "input" }
  },
  {
    name: "Create Circle",
    endpoint: "/api/circle/create",
    method: "POST",
    fields: { name: "input", members: "textarea", actions: "textarea" }
  },
  {
    name: "Delete Circle",
    endpoint: "/api/circle/delete/:id",
    method: "DELETE",
    fields: { id: "input" }
  },
  {
    name: "Get Circles",
    endpoint: "/api/circles",
    method: "GET",
    fields: { }
  },
  {
    name: "Add Member to Circle",
    endpoint: "/api/circle/add/:id",
    method: "PATCH",
    fields: { id: "input", member: "input" }
  },
  {
    name: "Remove Member from Circle",
    endpoint: "/api/circle/remove/:id",
    method: "PATCH",
    fields: { id: "input", member: "input" }
  },
  {
    name: "Change Circle Actions",
    endpoint: "/api/circle/change/:id",
    method: "PATCH",
    fields: { id: "input", actions: "textarea" }
  },
  {
    name: "Get Chat",
    endpoint: "/api/chat/:receiver",
    method: "GET",
    fields: { receiver: "input" }
  },
  {
    name: "Create Chat",
    endpoint: "/api/chat/create",
    method: "POST",
    fields: { receiver: "input", content: "textarea" }
  },
  {
    name: "Send Message",
    endpoint: "/api/chat/send/:receiver",
    method: "PATCH",
    fields: { receiver: "input", content: "textarea" }
  },
  {
    name: "Get Comments",
    endpoint: "/api/comments/:post",
    method: "GET",
    fields: { post: "input" }
  },
  {
    name: "Create Comment",
    endpoint: "/api/comment/create",
    method: "POST",
    fields: { post: "input", viewers: "input", message: "input" }
  },
  {
    name: "Delete Comment",
    endpoint: "/api/comment/delete/:id",
    method: "DELETE",
    fields: { id: "input" }
  },
  {
    name: "Get Feed",
    endpoint: "/api/feed/:owner",
    method: "GET",
    fields: { owner: "input" }
  },
  {
    name: "Create Feed",
    endpoint: "/api/feed/create",
    method: "POST",
    fields: { }
  },
  {
    name: "Update Feed",
    endpoint: "/api/feed/update",
    method: "PATCH",
    fields: { }
  },
  {
    name: "Change Feed Viewers",
    endpoint: "/api/feed/changeViewers",
    method: "PATCH",
    fields: { viewers: "textarea" }
  },
  {
    name: "Get Recommendations",
    endpoint: "/api/recommends",
    method: "GET",
    fields: { }
  },
  {
    name: "Create Recommendation",
    endpoint: "/api/recommend/create/:post/:target",
    method: "POST",
    fields: { post: "input", target: "input" }
  },
  {
    name: "Remove Recommendation",
    endpoint: "/api/recommend/delete/:id",
    method: "DELETE",
    fields: { id: "input" }
  }
  
  // You can now use the 'routes' array to access each route configuration as needed.
  
  
];

// Do not edit below here.
// If you are interested in how this works, feel free to ask on forum!

function updateResponse(code: string, response: string) {
  document.querySelector("#status-code")!.innerHTML = code;
  document.querySelector("#response-text")!.innerHTML = response;
}

async function request(method: HttpMethod, endpoint: string, params?: unknown) {
  try {
    if (method === "GET" && params) {
      endpoint += "?" + new URLSearchParams(params as Record<string, string>).toString();
      params = undefined;
    }

    const res = fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: params ? JSON.stringify(params) : undefined,
    });

    return {
      $statusCode: (await res).status,
      $response: await (await res).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      $statusCode: "???",
      $response: { error: "Something went wrong, check your console log.", details: e },
    };
  }
}

function fieldsToHtml(fields: Record<string, Field>, indent = 0, prefix = ""): string {
  return Object.entries(fields)
    .map(([name, tag]) => {
      return `
        <div class="field" style="margin-left: ${indent}px">
          <label>${name}:
          ${typeof tag === "string" ? `<${tag} name="${prefix}${name}"></${tag}>` : fieldsToHtml(tag, indent + 10, prefix + name + ".")}
          </label>
        </div>`;
    })
    .join("");
}

function getHtmlOperations() {
  return operations.map((operation) => {
    return `<li class="operation">
      <h3>${operation.name}</h3>
      <form class="operation-form">
        <input type="hidden" name="$endpoint" value="${operation.endpoint}" />
        <input type="hidden" name="$method" value="${operation.method}" />
        ${fieldsToHtml(operation.fields)}
        <button type="submit">Submit</button>
      </form>
    </li>`;
  });
}

function prefixedRecordIntoObject(record: Record<string, string>) {
  const obj: any = {}; // eslint-disable-line
  for (const [key, value] of Object.entries(record)) {
    if (!value) {
      continue;
    }
    const keys = key.split(".");
    const lastKey = keys.pop()!;
    let currentObj = obj;
    for (const key of keys) {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    currentObj[lastKey] = value;
  }
  return obj;
}

async function submitEventHandler(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const { $method, $endpoint, ...reqData } = Object.fromEntries(new FormData(form));

  // Replace :param with the actual value.
  const endpoint = ($endpoint as string).replace(/:(\w+)/g, (_, key) => {
    const param = reqData[key] as string;
    delete reqData[key];
    return param;
  });

  const data = prefixedRecordIntoObject(reqData as Record<string, string>);

  updateResponse("", "Loading...");
  const response = await request($method as HttpMethod, endpoint as string, Object.keys(data).length > 0 ? data : undefined);
  updateResponse(response.$statusCode.toString(), JSON.stringify(response.$response, null, 2));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#operations-list")!.innerHTML = getHtmlOperations().join("");
  document.querySelectorAll(".operation-form").forEach((form) => form.addEventListener("submit", submitEventHandler));
});
