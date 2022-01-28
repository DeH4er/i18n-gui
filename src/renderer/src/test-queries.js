import { buildQueries, queryHelpers } from "@testing-library/react";

const queryAllByTestAttribute = (container, attribute, value, ...args) => {
  return queryHelpers.queryAllByAttribute(
    `data-test${attribute}`,
    container,
    value,
    ...args
  );
};

const [
  queryByTestAttribute,
  getAllByTestAttribute,
  getByTestAttribute,
  findAllByTestAttribute,
  findByTestAttribute,
] = buildQueries(
  queryAllByTestAttribute,
  (c, attr, value) =>
    `Found multiple elements with data-test${attr} of: ${value}`,
  (c, attr, value) =>
    `Unable to find an element with data-test${attr} of: ${value}`
);

export {
  queryAllByTestAttribute,
  queryByTestAttribute,
  getAllByTestAttribute,
  getByTestAttribute,
  findAllByTestAttribute,
  findByTestAttribute,
};

