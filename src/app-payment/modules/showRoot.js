export const showRoot = () => {
  const pageLoader = document.querySelector(".page-loader");
  const rootContainer = document.querySelector(".wrapper .container");

  pageLoader.classList.add("d-none");
  rootContainer.classList.remove("d-none");
};