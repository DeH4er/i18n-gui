import { v4 as uuidv4 } from "uuid";
const fs = window.fs;

export function readJson(path) {
  return new Promise((res, rej) => {
    fs.readFile(path, "UTF-8", (err, f) => {
      if (!err) {
        try {
          const parsed = JSON.parse(f);
          res(parsed);
        } catch (e) {
          rej(e);
        }
      } else {
        rej(err);
      }
    });
  });
}

export async function readParseJson(file) {
  const f = await readJson(file.path);
  const parts = file.name.split(".");
  return {
    content: f,
    name: parts.slice(0, -1).join("."),
    fullname: file.name,
    path: file.path,
    extension: parts[parts.length - 1],
    id: uuidv4(),
  };
}
