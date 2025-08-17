// utils/parseYoutubeUrl.js
export const parseYoutubeUrl = (url) => {
  try {
    const urlObj = new URL(url);

    // case: https://www.youtube.com/watch?v=xxxx
    if (urlObj.hostname.includes("youtube.com") && urlObj.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
    }

    // case: https://youtu.be/xxxx
    if (urlObj.hostname === "youtu.be") {
      const videoId = urlObj.pathname.split("/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url; // fallback (Vimeo, Twitch, etc.)
  } catch {
    return url;
  }
};
