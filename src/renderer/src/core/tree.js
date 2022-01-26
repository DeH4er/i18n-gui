import { v4 as uuidv4 } from "uuid";

export function filterChildrenTree(node, fn, searchType) {
  if (node.children) {
    const newChildren = node.children
      .map((child) => {
        return filterChildrenTree(child, fn, searchType);
      })
      .filter(Boolean);

    if (newChildren.length === 0) {
      return null;
    }

    return {
      ...node,
      children: newChildren,
    };
  }

  if (!fn(node)) {
    return null;
  }

  return node;
}

function nodeToJson(node, language, json = {}) {
  if (!node.children) {
    const translation = node.translations[language];
    json[node.label] = translation;
    return json;
  }

  json[node.label] = {};
  node.children.forEach((child) => {
    nodeToJson(child, language, json[node.label]);
  });
}

export function treeToJsons(tree, languages) {
  const jsons = languages.reduce((acc, language) => {
    const rootNode = {};
    tree.forEach((node) => {
      nodeToJson(node, language, rootNode);
    });
    return { ...acc, [language]: rootNode };
  }, {});
  return jsons;
}

export function jsonsToTree(jsons, languages, path = []) {
  const firstJson = jsons[0];
  const keys = Object.keys(firstJson);

  return keys.map((key) => {
    const isString = typeof firstJson[key] === "string";
    const newPath = [...path, key];
    const values = jsons.map((json) => json[key]);

    return createNode({
      path: newPath,
      translations: isString
        ? languages.reduce(
            (acc, language, i) => ({
              ...acc,
              [language]: values[i],
            }),
            {}
          )
        : undefined,
      children: isString ? undefined : jsonsToTree(values, languages, newPath),
    });
  });
}

export function createNode({ translations, path, children }) {
  return {
    id: uuidv4(),
    path,
    label: path[path.length - 1],
    isExpanded: false,
    isSelected: false,
    translations,
    children,
  };
}

export function isPathExist(tree, path) {
  return !!getNode(tree, path);
}

export function getNode(tree, path) {
  let node = tree?.find((n) => n.label === path[0]);
  for (let i = 1; i < path.length && node; i++) {
    node = node?.children?.find?.((n) => n.label === path[i]);
  }

  return node;
}

export function getParentNode(tree, path) {
  if (path.length <= 1) {
    return;
  }

  let node = tree.find((n) => n.label === path[0]);
  for (let i = 1; i < path.length - 1; i++) {
    node = node.children.find((n) => n.label === path[i]);
  }

  return node;
}

export function modifyNode(tree, path, fn) {
  const node = getNode(tree, path);

  if (node) {
    fn(node);
  }
}

export function modifyEveryInPath(tree, path, fn) {
  let node = tree.find((n) => n.label === path[0]);
  fn(node);

  for (let i = 1; i < path.length; i++) {
    node = node.children.find((n) => n.label === path[i]);
    fn(node);
  }
}

export function rebuildChildrenPath(node, path) {
  node?.children?.forEach((c) => {
    const newPath = [...path, c.label];
    c.path = newPath;
    rebuildChildrenPath(c, newPath);
  });
}

export function createNestedPath(node, path, pathIndex = 0) {
  if (pathIndex >= path.length) {
    return node;
  }

  const isRootNode = pathIndex === 0;
  const nodeContainer = isRootNode ? node : node.children;
  const foundNode = nodeContainer?.find?.((c) => c.label === path[pathIndex]);
  const newNode = createNode({
    path: path.slice(0, pathIndex + 1),
  });

  let nestedNode;
  if (foundNode) {
    nestedNode = foundNode;
  } else if (isRootNode) {
    nestedNode = newNode;
    node.push(nestedNode);
    sortTreeArray(node);
  } else {
    nestedNode = newNode;
    node.children = [...(node.children ?? []), nestedNode];
    sortTreeArray(node.children);
    nestedNode = newNode;
  }

  return createNestedPath(nestedNode, path, pathIndex + 1);
}

export function modifyEveryChildNode(node, fn) {
  if (node) {
    fn(node);
  }

  node?.children?.forEach?.((child) => {
    modifyEveryChildNode(child, fn);
  });
}

export function replaceNodeOrPush(nodeContainer, node) {
  const sameNodeIndex = nodeContainer.findIndex((n) => n.label === node.label);

  if (sameNodeIndex !== -1) {
    nodeContainer.splice(sameNodeIndex, 1);
  }

  nodeContainer.push(node);
}

export function expandPath(tree, path) {
  modifyEveryInPath(tree, path, (treeNode) => {
    treeNode.isExpanded = true;
  });
}

export function removeNode(tree, path) {
  const nodeContainer = isRootNode(path)
    ? tree
    : getParentNode(tree, path).children;
  const index = nodeContainer.findIndex(
    (n) => n.label === path[path.length - 1]
  );
  nodeContainer.splice(index, 1);
}

export function isRootNode(path) {
  return path.length === 1;
}

export function isSamePath(p1, p2) {
  if (p1.length !== p2.length) {
    return false;
  }

  let same = true;
  for (let i = 0; i < p1.length && same; i++) {
    same = p1[i] === p2[i];
  }

  return same;
}

export function isParentOrSamePath(parentPath, childPath) {
  if (childPath.length < parentPath.length) {
    return false;
  }

  let isParentOrSame = true;
  for (let i = 0; i < parentPath.length; i++) {
    isParentOrSame = parentPath[i] === childPath[i];
  }

  return isParentOrSame;
}

export function countLeafs(node) {
  if (node.children) {
    return node.children
      .map((child) => countLeafs(child))
      .reduce((acc, v) => acc + v, 0);
  } else {
    return 1;
  }
}

export function sortTreeArray(tree) {
  tree.sort((a, b) => a.label.localeCompare(b.label, "en-US-u-kn-true"));
}
