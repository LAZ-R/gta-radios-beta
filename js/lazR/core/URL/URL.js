export const getURLParameter = (parameterName) => {
  return new URLSearchParams(window.location.search).get(parameterName);
}