export type HttpClass = "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

export type HttpStatus = {
  code: number;
  phrase: string;
  klass: HttpClass;
  blurb: string;
};

export const httpStatuses: HttpStatus[] = [
  { code: 100, phrase: "Continue", klass: "1xx", blurb: "Request headers received; continue with the body." },
  { code: 101, phrase: "Switching Protocols", klass: "1xx", blurb: "The server is switching protocols as requested." },
  { code: 102, phrase: "Processing", klass: "1xx", blurb: "WebDAV: the request is still being processed." },
  { code: 200, phrase: "OK", klass: "2xx", blurb: "The request succeeded." },
  { code: 201, phrase: "Created", klass: "2xx", blurb: "A resource was created, usually from POST or PUT." },
  { code: 202, phrase: "Accepted", klass: "2xx", blurb: "Accepted for processing; the result is not ready yet." },
  { code: 204, phrase: "No Content", klass: "2xx", blurb: "Success with an empty body. Common on DELETE." },
  { code: 206, phrase: "Partial Content", klass: "2xx", blurb: "A byte-range request succeeded." },
  { code: 301, phrase: "Moved Permanently", klass: "3xx", blurb: "The resource has a new permanent URI." },
  { code: 302, phrase: "Found", klass: "3xx", blurb: "Temporary redirect. Clients often switch to GET." },
  { code: 303, phrase: "See Other", klass: "3xx", blurb: "Redirect to a GET of another URI." },
  { code: 304, phrase: "Not Modified", klass: "3xx", blurb: "Cached representation is still fresh." },
  { code: 307, phrase: "Temporary Redirect", klass: "3xx", blurb: "Temporary redirect that keeps the method." },
  { code: 308, phrase: "Permanent Redirect", klass: "3xx", blurb: "Permanent redirect that keeps the method." },
  { code: 400, phrase: "Bad Request", klass: "4xx", blurb: "The server cannot parse or will not process the request." },
  { code: 401, phrase: "Unauthorized", klass: "4xx", blurb: "Authentication is required or has failed." },
  { code: 403, phrase: "Forbidden", klass: "4xx", blurb: "Authenticated, but not allowed." },
  { code: 404, phrase: "Not Found", klass: "4xx", blurb: "No current representation for the target." },
  { code: 405, phrase: "Method Not Allowed", klass: "4xx", blurb: "The method is known but not supported here." },
  { code: 406, phrase: "Not Acceptable", klass: "4xx", blurb: "No representation matches Accept headers." },
  { code: 408, phrase: "Request Timeout", klass: "4xx", blurb: "The server timed out waiting for the request." },
  { code: 409, phrase: "Conflict", klass: "4xx", blurb: "The request conflicts with the current state." },
  { code: 410, phrase: "Gone", klass: "4xx", blurb: "The resource is gone and will not return." },
  { code: 412, phrase: "Precondition Failed", klass: "4xx", blurb: "An If-* precondition was false." },
  { code: 413, phrase: "Content Too Large", klass: "4xx", blurb: "The request body is larger than the server allows." },
  { code: 415, phrase: "Unsupported Media Type", klass: "4xx", blurb: "The payload format is not supported." },
  { code: 422, phrase: "Unprocessable Content", klass: "4xx", blurb: "Well-formed, but semantically invalid." },
  { code: 429, phrase: "Too Many Requests", klass: "4xx", blurb: "Rate limited. Back off and retry." },
  { code: 500, phrase: "Internal Server Error", klass: "5xx", blurb: "The server hit an unexpected condition." },
  { code: 501, phrase: "Not Implemented", klass: "5xx", blurb: "The method or feature is not implemented." },
  { code: 502, phrase: "Bad Gateway", klass: "5xx", blurb: "An upstream proxy got an invalid response." },
  { code: 503, phrase: "Service Unavailable", klass: "5xx", blurb: "Overloaded or down for maintenance." },
  { code: 504, phrase: "Gateway Timeout", klass: "5xx", blurb: "An upstream server did not respond in time." },
];

export function filterHttpStatuses(query: string, klass: HttpClass | "all"): HttpStatus[] {
  const needle = query.trim().toLowerCase();
  return httpStatuses.filter((status) => {
    if (klass !== "all" && status.klass !== klass) {
      return false;
    }
    if (!needle) {
      return true;
    }
    return (
      String(status.code).includes(needle) ||
      status.phrase.toLowerCase().includes(needle) ||
      status.blurb.toLowerCase().includes(needle) ||
      status.klass.includes(needle)
    );
  });
}
