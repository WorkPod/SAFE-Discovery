// @ts-nocheck
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DarkThemeIcon from "@mui/icons-material/Brightness4";
import LightThemeIcon from "@mui/icons-material/Brightness7";
import Link from "next/link";
import { useRouter } from "next/router";

// import ChainLabel from 'src/components/chain-label/ChainLabel'
import { useTheme } from "../store/themeContext";
// import { useAccountAbstraction } from 'src/store/accountAbstractionContext'

function Header() {
  const { switchThemeMode, isDarkTheme } = useTheme();

  const router = useRouter();

  const handleClick = (e: any, href) => {
    e.preventDefault();
    router.push(href);
  };

  // const { chain } = useAccountAbstraction()

  return (
    <AppBar position="static">
      <Container maxWidth="false">
        <Toolbar disableGutters>
          {/* App Logo */}
          <img
            style={{ cursor: "pointer" }}
            id="app-logo-header"
            src="/Removal-536.png"
            alt="app logo"
            className="w-16 h-16"
          />
          <p className="text-white font-bold text-xl">Safe Discovery</p>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            flexGrow={1}
            gap={1}
          >
            {/* chain label */}
            {/* {chain && (
              <Box display="flex" justifyContent="flex-end" alignItems="center">
                <ChainLabel chain={chain} />
              </Box>
            )} */}

            {/* Switch Theme mode button */}
            <div className="flex flex-row gap-6 mr-8">
              <Link href="/transaction">
                <a onClick={(event) => handleClick(event, "/transaction")}>
                  <div className="text-lg font-medium flex">
                    Multisig Transactions
                  </div>
                </a>
              </Link>
              <Link href="/safe">
                <a onClick={(event) => handleClick(event, "/safe")}>
                  <div className="text-lg font-medium flex">Safes</div>
                </a>
              </Link>
              <Link href="/plugin">
                <a onClick={(event) => handleClick(event, "/plugin")}>
                  <div className="text-lg font-medium flex">Plugins</div>
                </a>
              </Link>
            </div>
            <Tooltip title="Switch Theme mode">
              <IconButton
                sx={{ marginLeft: 2 }}
                size="large"
                color="inherit"
                aria-label="switch theme mode"
                edge="end"
                onClick={switchThemeMode}
              >
                {isDarkTheme ? <LightThemeIcon /> : <DarkThemeIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
