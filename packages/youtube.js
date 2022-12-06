const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

class ParserService {
  parseVideo(data) {
    if (!data) return undefined;

    try {
      let title = "";
      if (data.compactVideoRenderer) {
        title = data.compactVideoRenderer.title.runs[0].text;
        title = title.replace("\\\\", "\\");

        try {
          title = decodeURIComponent(title);
        } catch (e) {}

        return {
          id: {
            videoId: data.compactVideoRenderer.videoId,
          },
          url: `https://www.youtube.com/watch?v=${data.compactVideoRenderer.videoId}`,
          title,
          description:
            data.compactVideoRenderer.descriptionSnippet &&
            data.compactVideoRenderer.descriptionSnippet.runs[0]
              ? data.compactVideoRenderer.descriptionSnippet.runs[0].text
              : "",
          duration_raw: data.compactVideoRenderer.lengthText
            ? data.compactVideoRenderer.lengthText.simpleText
            : null,
          snippet: {
            url: `https://www.youtube.com/watch?v=${data.compactVideoRenderer.videoId}`,
            duration: data.compactVideoRenderer.lengthText
              ? data.compactVideoRenderer.lengthText.simpleText
              : null,
            publishedAt: data.compactVideoRenderer.publishedTimeText
              ? data.compactVideoRenderer.publishedTimeText.simpleText
              : null,
            thumbnails: {
              id: data.compactVideoRenderer.videoId,
              url: data.compactVideoRenderer.thumbnail.thumbnails[
                data.compactVideoRenderer.thumbnail.thumbnails.length - 1
              ].url,
              default:
                data.compactVideoRenderer.thumbnail.thumbnails[
                  data.compactVideoRenderer.thumbnail.thumbnails.length - 1
                ],
              high: data.compactVideoRenderer.thumbnail.thumbnails[
                data.compactVideoRenderer.thumbnail.thumbnails.length - 1
              ],
              height:
                data.compactVideoRenderer.thumbnail.thumbnails[
                  data.compactVideoRenderer.thumbnail.thumbnails.length - 1
                ].height,
              width:
                data.compactVideoRenderer.thumbnail.thumbnails[
                  data.compactVideoRenderer.thumbnail.thumbnails.length - 1
                ].width,
            },
            title,
            views:
              data.compactVideoRenderer.viewCountText &&
              data.compactVideoRenderer.viewCountText.simpleText
                ? data.compactVideoRenderer.viewCountText.simpleText.replace(
                    /[^0-9]/g,
                    ""
                  )
                : 0,
          },
          views:
            data.compactVideoRenderer.viewCountText &&
            data.compactVideoRenderer.viewCountText.simpleText
              ? data.compactVideoRenderer.viewCountText.simpleText.replace(
                  /[^0-9]/g,
                  ""
                )
              : 0,
        };
      } else if (data.videoWithContextRenderer) {
        if (
          data.videoWithContextRenderer.headline?.runs &&
          data.videoWithContextRenderer.headline?.runs.length > 0
        ) {
          title = data.videoWithContextRenderer.headline?.runs[0].text;
        } else {
          title =
            data.videoWithContextRenderer.headline?.accessibility
              ?.accessibilityData?.label;
        }

        title = title.replace("\\\\", "\\");

        try {
          title = decodeURIComponent(title);
        } catch (e) {
          // @ts-ignore
        }

        return {
          id: {
            videoId: data.videoWithContextRenderer.videoId,
          },
          url: `https://www.youtube.com/watch?v=${data.videoWithContextRenderer.videoId}`,
          title,
          description: "",
          duration_raw:
            data.videoWithContextRenderer.lengthText?.accessibility
              ?.accessibilityData?.text,
          snippet: {
            url: `https://www.youtube.com/watch?v=${data.videoWithContextRenderer.videoId}`,
            duration:
              data.videoWithContextRenderer.lengthText?.accessibility
                ?.accessibilityData?.text,
            publishedAt:
              data.videoWithContextRenderer.publishedTimeText?.runs?.length > 0
                ? data.videoWithContextRenderer.publishedTimeText?.runs[0].text
                : null,
            thumbnails: {
              id: data.videoWithContextRenderer.videoId,
              url: data.videoWithContextRenderer.thumbnail.thumbnails[
                data.videoWithContextRenderer.thumbnail.thumbnails.length - 1
              ].url,
              default:
                data.videoWithContextRenderer.thumbnail.thumbnails[
                  data.videoWithContextRenderer.thumbnail.thumbnails.length - 1
                ],
              high: data.videoWithContextRenderer.thumbnail.thumbnails[
                data.videoWithContextRenderer.thumbnail.thumbnails.length - 1
              ],
              height:
                data.videoWithContextRenderer.thumbnail.thumbnails[
                  data.videoWithContextRenderer.thumbnail.thumbnails.length - 1
                ].height,
              width:
                data.videoWithContextRenderer.thumbnail.thumbnails[
                  data.videoWithContextRenderer.thumbnail.thumbnails.length - 1
                ].width,
            },
            title,
            views:
              data.videoWithContextRenderer.shortViewCountText?.accessibility?.accessibilityData?.label?.replace(
                /[^0-9]/g,
                ""
              ),
          },
          views:
            data.videoWithContextRenderer.shortViewCountText?.accessibility?.accessibilityData?.label?.replace(
              /[^0-9]/g,
              ""
            ),
        };
      }

      return undefined;
    } catch (e) {
      return undefined;
    }
  }
}

const rfc3986EncodeURIComponent = (str) =>
  encodeURIComponent(str).replace(/[!'()*]/g, escape);

module.exports = async function searchVideo(searchQuery) {
  const results = [];
  let details = [];
  let fetched = false;
  const options = { type: "video", limit: 0 };

  const searchRes = await fetch(
    `https://www.youtube.com/results?q=${rfc3986EncodeURIComponent(
      searchQuery.trim()
    )}&hl=en`
  );
  let html = await searchRes.text();
  // try to parse html
  try {
    const data = html.split("ytInitialData = '")[1].split("';</script>")[0];
    // @ts-ignore
    html = data.replace(/\\x([0-9A-F]{2})/gi, (...items) => {
      return String.fromCharCode(parseInt(items[1], 16));
    });
    html = html.replaceAll('\\\\"', "");
    html = JSON.parse(html);
  } catch (e) {
    /* nothing */
  }

  if (
    html &&
    html.contents &&
    html.contents.sectionListRenderer &&
    html.contents.sectionListRenderer.contents &&
    html.contents.sectionListRenderer.contents.length > 0 &&
    html.contents.sectionListRenderer.contents[0].itemSectionRenderer &&
    html.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents
      .length > 0
  ) {
    details =
      html.contents.sectionListRenderer.contents[0].itemSectionRenderer
        .contents;
    fetched = true;
  }
  // backup/ alternative parsing
  if (!fetched) {
    try {
      details = JSON.parse(
        html
          .split('{"itemSectionRenderer":{"contents":')
          [html.split('{"itemSectionRenderer":{"contents":').length - 1].split(
            ',"continuations":[{'
          )[0]
      );
      fetched = true;
    } catch (e) {
      /* nothing */
    }
  }
  if (!fetched) {
    try {
      details = JSON.parse(
        html
          .split('{"itemSectionRenderer":')
          [html.split('{"itemSectionRenderer":').length - 1].split(
            '},{"continuationItemRenderer":{'
          )[0]
      ).contents;
      fetched = true;
    } catch (e) {
      /* nothing */
    }
  }

  if (!fetched) return [];

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < details.length; i++) {
    if (
      typeof options.limit === "number" &&
      options.limit > 0 &&
      results.length >= options.limit
    )
      break;
    const data = details[i];

    const parserService = new ParserService();
    const parsed = parserService.parseVideo(data);
    if (!parsed) continue;
    const res = parsed;

    results.push(res);
  }

  return results;
};
