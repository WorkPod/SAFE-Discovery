import { ThemeProvider } from "../../store/themeContext";
// import { AccountAbstractionProvider } from "../../store/accountAbstractionContext";

const Providers = ({ children }: { children: JSX.Element }) => {
  return (
    <ThemeProvider>
      <div>{children}</div>
    </ThemeProvider>
  );
};

export default Providers;
