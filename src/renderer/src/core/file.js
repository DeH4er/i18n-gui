import { v4 as uuidv4 } from 'uuid';

const { fs } = window;
const { path } = window;

export function readJson(filepath) {
  return new Promise((res, rej) => {
    fs.readFile(filepath, 'UTF-8', (err, f) => {
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

export function writeJson(json, filepath, options) {
  return new Promise((res, rej) => {
    try {
      const str = JSON.stringify(json, undefined, options.tabSize);
      fs.writeFile(filepath, str, (err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    } catch (e) {
      rej(e);
    }
  });
}

export async function readTranslationFile(filepath) {
  const f = await readJson(filepath);
  const ext = path.extname(filepath);
  return {
    content: f,
    name: path.basename(filepath, ext),
    path: filepath,
    extension: ext,
    id: uuidv4(),
  };
}
