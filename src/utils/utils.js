const render = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

export {render};
