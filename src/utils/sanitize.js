import xss from "xss";

const xssOptions = {
  whiteList: {},
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style"]
};

export function sanitizeString(input) {
  if (typeof input !== "string") return input;
  return xss(input, xssOptions);
}
