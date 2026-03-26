import { createGlobalStyle } from 'styled-components';

import colors from './variables/colors';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: ${colors.bgColor};
    color: ${colors.text.dark.medium};
  }

  body {
    -webkit-font-smoothing: antialiased;
  }

  body,
  input,
  button {
    font: 14px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  *:focus {
    outline: 0;
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
  }
`;
