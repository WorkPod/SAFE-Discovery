import { ThemeProvider } from "../../store/themeContext";
// import { AccountAbstractionProvider } from "../../store/accountAbstractionContext";

const Providers = ({ children }: { children: JSX.Element }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default Providers;
