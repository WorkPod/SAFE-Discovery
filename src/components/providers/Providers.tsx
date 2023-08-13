// @ts-nocheck
import { Fragment, ReactNode, useState, useEffect } from "react";
import { ThemeProvider } from "../../store/themeContext";
import { getProvider } from "../../logic/web3";
import { ethers, BigNumber } from "ethers";
import SafeApiKit from "@safe-global/api-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import {
  TextFieldInput,
  EthHashInfo,
  SafeThemeProvider,
  ExplorerButton,
} from "@safe-global/safe-react-components";
// import { AccountAbstractionProvider } from "../../store/accountAbstractionContext";

const Providers = ({ children }: { children: JSX.Element }) => {
  const [safeService, setSafeService] = useState(null);
  const [optimismSafeService, setOptimismSafeService] = useState(null);
  const [baseSafeService, setBaseSafeService] = useState(null);

  const setStartValues = async () => {
    const provider = await getProvider();
    // console.log(provider);
    // const safeOwner = provider.getSigner(0);

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: provider, //safeOwner,
    });

    setSafeService(
      new SafeApiKit({
        txServiceUrl: "https://safe-transaction-goerli.safe.global/", //"https://safe-transaction-polygon.safe.global/",
        ethAdapter,
      })
    );

    setOptimismSafeService(
      new SafeApiKit({
        txServiceUrl: "https://safe-transaction-optimism.safe.global/", //"https://safe-transaction-polygon.safe.global/",
        ethAdapter,
      })
    );

    setBaseSafeService(
      new SafeApiKit({
        txServiceUrl: "https://safe-transaction-base.safe.global/", //"https://safe-transaction-polygon.safe.global/",
        ethAdapter,
      })
    );
  };

  useEffect(() => {
    // fetchSafeDetails("");
    // initializeDapp();
    setStartValues();
  }, []);

  return <ThemeProvider>{children}</ThemeProvider>;
};

export default Providers;
