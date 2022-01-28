import { getByRole } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { createNode } from "src/core/tree";
import { getByTestAttribute, queryByTestAttribute } from "src/test-queries";
import { render, screen } from "src/test-utils";
import Editor from "./Editor";

describe("Editor", () => {
  const create = (state = {}) => {
    return render(<Editor />, {
      storeOptions: {
        preloadedState: {
          editor: {
            translations: [],
            projectId: "a",
            keyMode: "tree",
            search: "",
            selectedTranslation: null,
            recentProjects: {
              a: {
                languages: ["en", "fr", "de"],
                generationRules: { en: "", fr: "", de: "" },
              },
            },
            ...state,
          },
        },
      },
    });
  };

  const isSelectedNode = (path) => {
    const node = getNode(path);
    return node.getAttribute("data-testselected") === "true";
  };

  const isExpandedNode = (path) => {
    const node = getNode(path);
    return node.getAttribute("data-testexpanded") === "true";
  };

  const expandNode = (path) => {
    if (!isExpandedNode(path)) {
      clickNode(path);
    }
  };

  const getNode = (path) => {
    return getByTestAttribute(document.body, "path", path);
  };

  const getAllNodes = () => {
    return screen.getAllByTestId("tree-node");
  };

  const hasOnlyNodes = (paths) => {
    const nodes = getAllNodes();
    nodes.forEach((n) => {
      expect(paths).toContain(n.getAttribute("data-testpath"));
    });
  };

  const hasNode = (path) => {
    getNode(path);
  };

  const hasNodes = (paths) => {
    paths.forEach(hasNode);
  };

  const hasNoNode = (path) => {
    expect(queryByTestAttribute(document.body, "path", path)).toBeFalsy();
  };

  const clickNode = (path) => {
    let node = getNode(path);
    userEvent.click(node);
    return node;
  };

  const getDialog = () => screen.getByRole("dialog");

  const confirmDialog = () => {
    const dialog = getDialog();
    userEvent.click(getByRole(dialog, "button", { name: /confirm/i }));
  };

  const renameNode = (oldPath, newPath) => {
    clickNode(oldPath);
    userEvent.click(screen.getByTestId("rename-node"));
    const dialog = getDialog();
    const pathInput = getByRole(dialog, "textbox");
    userEvent.clear(pathInput);
    userEvent.type(pathInput, newPath);
    confirmDialog();
  };

  const deleteNode = (path) => {
    clickNode(path);
    userEvent.click(screen.getByTestId("remove-node"));
    confirmDialog();
  };

  const expandAll = () => {
    userEvent.click(screen.getByTestId("expand-all"));
  };

  const collapseAll = () => {
    userEvent.click(screen.getByTestId("collapse-all"));
  };

  const clearSearch = () => {
    const input = screen.getByRole("searchbox");
    userEvent.clear(input);
    return input;
  };

  const search = (s) => {
    const input = clearSearch();
    userEvent.type(input, s);
    return input;
  };

  test("render", () => {
    expect(create()).toBeTruthy();
  });

  test("select root key", () => {
    create({
      translations: [
        createNode({
          path: ["A"],
          translations: { en: "", fr: "", de: "" },
        }),
      ],
    });

    expect(isSelectedNode("A")).toBeFalsy();
    clickNode("A");
    expect(isSelectedNode("A")).toBeTruthy();
  });

  test("select and expand/collapse root group", () => {
    create({
      translations: [
        createNode({
          path: ["A"],
          children: [
            createNode({
              path: ["A", "B"],
              translations: { en: "", de: "", fr: "" },
            }),
          ],
        }),
      ],
    });

    hasNoNode("A.B");
    expandNode("A");
    hasNode("A");
    hasNode("A.B");
    clickNode("A");
    hasNoNode("A.B");
  });

  test("expand/collapse all", () => {
    create({
      translations: [
        createNode({
          path: ["A"],
          children: [
            createNode({
              path: ["A", "A1"],
              children: [
                createNode({
                  path: ["A", "A1", "A2"],
                  translations: { en: "", fr: "", de: "" },
                }),
                createNode({
                  path: ["A", "A1", "A3"],
                  translations: { en: "", fr: "", de: "" },
                }),
              ],
            }),
          ],
        }),
        createNode({
          path: ["B"],
          children: [
            createNode({
              path: ["B", "B1"],
              translations: { en: "", fr: "", de: "" },
            }),
            createNode({
              path: ["B", "B2"],
              translations: { en: "", fr: "", de: "" },
            }),
          ],
        }),
      ],
    });

    hasOnlyNodes(["A", "B"]);
    expandAll();
    hasOnlyNodes(["A", "A.A1", "A.A1.A2", "A.A1.A3", "B", "B.B1", "B.B2"]);

    collapseAll();
    hasOnlyNodes(["A", "B"]);

    expandNode("A");
    hasOnlyNodes(["A", "B", "A.A1"]);
  });

  test("rename root key to root key", () => {
    create({
      translations: [
        createNode({
          path: ["A"],
          translations: { en: "", fr: "", de: "" },
        }),
      ],
    });

    renameNode("A", "B");
    expect(isSelectedNode("B")).toBeTruthy();
    hasNoNode("A");
  });

  test("rename root key with nested key", () => {
    create({
      translations: [
        createNode({
          path: ["A"],
          translations: { en: "", fr: "", de: "" },
        }),
      ],
    });

    renameNode("A", "B.C.D");
    expect(isSelectedNode("B.C.D")).toBeTruthy();
    hasOnlyNodes(["B", "B.C", "B.C.D"])
  });

  test("move child key to different parent", async () => {
    create({
      translations: [
        createNode({
          path: ["A"],
          children: [
            createNode({
              path: ["A", "A1"],
              translations: { en: "", fr: "", de: "" },
            }),
            createNode({
              path: ["A", "A2"],
              translations: { en: "", fr: "", de: "" },
            }),
          ],
        }),
        createNode({
          path: ["B"],
          children: [
            createNode({
              path: ["B", "B1"],
              translations: { en: "", fr: "", de: "" },
            }),
            createNode({
              path: ["B", "B2"],
              translations: { en: "", fr: "", de: "" },
            }),
          ],
        }),
      ],
    });

    expandAll();
    renameNode("A.A1", "B.B3");
    expect(isSelectedNode("B.B3")).toBeTruthy();

    hasOnlyNodes(["A", "A.A2", "B", "B.B1", "B.B2", "B.B3"]);
  });

  test("rename child key to root", () => {
    create({
      translations: [
        createNode({
          path: ["A"],
          children: [
            createNode({
              path: ["A", "A1"],
              translations: { en: "", fr: "", de: "" },
            }),
            createNode({
              path: ["A", "A2"],
              translations: { en: "", fr: "", de: "" },
            }),
          ],
        }),
        createNode({
          path: ["B"],
          children: [
            createNode({
              path: ["B", "B1"],
              translations: { en: "", fr: "", de: "" },
            }),
            createNode({
              path: ["B", "B2"],
              translations: { en: "", fr: "", de: "" },
            }),
          ],
        }),
      ],
    });

    expandNode("A");
    renameNode("A.A1", "C");
    expect(isSelectedNode("C")).toBeTruthy();
    expandNode("B");
    hasOnlyNodes(["A", "A.A2", "B", "B.B1", "B.B2", "C"]);
  });

  test("delete root group", () => {
    create({
      translations: [
        createNode({
          path: ["A"],
          children: [
            createNode({
              path: ["A", "A1"],
              translations: { en: "", fr: "", de: "" },
            }),
            createNode({
              path: ["A", "A2"],
              translations: { en: "", fr: "", de: "" },
            }),
          ],
        }),
        createNode({
          path: ["B"],
          children: [
            createNode({
              path: ["B", "B1"],
              translations: { en: "", fr: "", de: "" },
            }),
            createNode({
              path: ["B", "B2"],
              translations: { en: "", fr: "", de: "" },
            }),
          ],
        }),
      ],
    });

    deleteNode("A");
    hasNoNode("A");
    expandNode("B");
    hasOnlyNodes(["B", "B.B1", "B.B2"]);
  });

  test("delete child group", () => {
    create({
      translations: [
        createNode({
          path: ["A"],
          children: [
            createNode({
              path: ["A", "A1"],
              children: [
                createNode({
                  path: ["A", "A1", "A2"],
                  translations: { en: "", fr: "", de: "" },
                }),

                createNode({
                  path: ["A", "A1", "A2"],
                  translations: { en: "", fr: "", de: "" },
                }),
              ],
            }),
          ],
        }),
        createNode({
          path: ["B"],
          children: [
            createNode({
              path: ["B", "B1"],
              translations: { en: "", fr: "", de: "" },
            }),
            createNode({
              path: ["B", "B2"],
              translations: { en: "", fr: "", de: "" },
            }),
          ],
        }),
      ],
    });

    expandNode("A");
    deleteNode("A.A1");
    expandNode("B");
    hasOnlyNodes(["A", "B", "B.B1", "B.B2"]);
  });

  test("search by key name", () => {
    create({
      translations: [
        createNode({
          path: ["A"],
          children: [
            createNode({
              path: ["A", "A1"],
              children: [
                createNode({
                  path: ["A", "A1", "FIRST_ONE"],
                  translations: { en: "", fr: "", de: "" },
                }),
                createNode({
                  path: ["A", "A1", "SECOND_ONE"],
                  translations: { en: "", fr: "", de: "" },
                }),
              ],
            }),
          ],
        }),
        createNode({
          path: ["B"],
          children: [
            createNode({
              path: ["B", "FIRST_TWO"],
              translations: { en: "", fr: "", de: "" },
            }),
            createNode({
              path: ["B", "SECOND_TWO"],
              translations: { en: "", fr: "", de: "" },
            }),
          ],
        }),
      ],
    });

    expandAll();
    hasOnlyNodes([
      "A",
      "A.A1",
      "A.A1.FIRST_ONE",
      "A.A1.SECOND_ONE",
      "B",
      "B.FIRST_TWO",
      "B.SECOND_TWO",
    ]);

    search("one");
    hasOnlyNodes(["A", "A.A1", "A.A1.FIRST_ONE", "A.A1.SECOND_ONE"]);

    clearSearch();
    hasOnlyNodes([
      "A",
      "A.A1",
      "A.A1.FIRST_ONE",
      "A.A1.SECOND_ONE",
      "B",
      "B.FIRST_TWO",
      "B.SECOND_TWO",
    ]);

    search("two");
    hasOnlyNodes(["B", "B.FIRST_TWO", "B.SECOND_TWO"]);

    search("first");
    hasOnlyNodes(["A", "A.A1", "A.A1.FIRST_ONE", "B", "B.FIRST_TWO"]);

    search("second");
    hasOnlyNodes(["A", "A.A1", "A.A1.SECOND_ONE", "B", "B.SECOND_TWO"]);
  });
});
