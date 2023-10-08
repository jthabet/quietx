// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled
chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    id: "twitter_mute_word_select",
    title: "mute keyword",
    type: "normal",
    contexts: ["selection"],
    documentUrlPatterns: ["*://twitter.com/*"],
  });

  // Opens the options page on install
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.openOptionsPage();
  }

  // Initialize the debug flag to false
  // auto create and set debug flag to false
  chrome.storage.local
    .set({ options: { debug: false } })
    .catch((err) => console.error(err));
});

// A function to handle errors.
function onError(error: Error) {
  console.error(`Error: ${error}`);
}

// A function to create notification.
function createNotification(text: string, imageUrl: URL) {
  chrome.notifications.create("", {
    iconUrl: imageUrl.pathname,
    type: "basic",
    title: "Twitter Shush",
    message: text,
  });
}

// Event handler for context menu click.
async function onContextMenuClick(item: chrome.contextMenus.OnClickData) {
  const imageUrl = new URL(
    "assets/2021Twitterlogo-blue.png?as=webp&width=125",
    import.meta.url,
  );
  const menuItemId = item.menuItemId;
  const selectionText = item.selectionText;

  if (menuItemId !== "twitter_mute_word_select" || !selectionText) return;

  try {
    const response = await chrome.cookies.get({
      url: "https://twitter.com",
      name: "ct0",
    });
    const csrfToken = response?.value;
    if (csrfToken) {
      const result = await chrome.storage.local.get("bearer");
      await addKeyword(result.bearer, selectionText, csrfToken);
    } else {
      // Handle the case where csrfToken is undefined
      console.error("csrfToken is undefined");
    }
    console.info("successfully added keyword : %s", selectionText);
    createNotification(selectionText, imageUrl);
  } catch (error) {
    const customError =
      error instanceof Error ? error : new Error(String(error));
    onError(customError);
  }
}

// Register the event handler to the context menu click event.
chrome.contextMenus.onClicked.addListener(onContextMenuClick);

// addKeyword add keyword to the mutes endpoint on Twitter (mute a word)
function addKeyword(bearerToken: string, word: string, CSRFToken: string) {
  const form = new URLSearchParams();
  form.append("keyword", word);
  form.append("mute_surfaces", "notifications,home_timeline,tweet_replies");
  form.append("mute_options", "");
  form.append("duration", "");

  return fetch("https://twitter.com/i/api/1.1/mutes/keywords/create.json", {
    headers: {
      authorization: `Bearer ${bearerToken}`,
      "content-type": "application/x-www-form-urlencoded",
      "x-csrf-token": CSRFToken,
      "x-twitter-active-user": "yes",
      "x-twitter-auth-type": "OAuth2Session",
      "x-twitter-client-language": "en",
    },
    body: form.toString(),
    method: "POST",
  });
}
