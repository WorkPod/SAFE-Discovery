// @ts-nocheck
import { Fragment, ReactNode, useState, useEffect, useCallback } from "react";
import { truncateAddress } from "../../utils";
import { ethers, BigNumber } from "ethers";
import { useAccount, WagmiProvider, useChainId, useNetwork } from "wagmi";
import { useRouter } from "next/router";
const fetch = require("node-fetch");
import { useEthersProvider, useEthersSigner } from "../../ethers";
import SafeApiKit from "@safe-global/api-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import {
  EthHashInfo,
  SafeThemeProvider,
} from "@safe-global/safe-react-components";
import { Input, TextField, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { loadPlugins } from "../../logic/plugins";
import { Plugin } from "./Plugin";
import { getProvider } from "../../logic/web3";

function Plugins() {
  const [safeTxHash, setSafeTxHash] = useState();
  const [safeTxs, setSafeTxs] = useState(null);
  const [showFlagged, setFilterFlagged] = useState<boolean>(true);
  const [plugins, setPlugins] = useState<string[]>([]);
  const [safeService, setSafeService] = useState(null);
  const fetchData = useCallback(async () => {
    try {
      setPlugins([]);
      console.log(await loadPlugins(!showFlagged));
      setPlugins(await loadPlugins(!showFlagged));
    } catch (e) {
      console.warn(e);
    }
  }, [showFlagged]);
  useEffect(() => {
    setStartValues();
    fetchData();
  }, [fetchData]);

  // const web3Provider = new ethers.providers.Web3Provider(window.ethereum); //"https://rpc.gnosis.gateway.fm";
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // let safeService;

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
  };

  const initializeDapp = async () => {
    // const serviceInfo: SafeServiceInfoResponse =
    //   await safeService.getServiceInfo();
    // const masterCopies: MasterCopyResponse =
    //   await safeService.getServiceMasterCopiesInfo();
    // const ownerAddress: string = "0x631B317Cb75feD1958B0D5844436FAe1A82b3a95"; //account.address;
    // const safes: OwnerResponse = await safeService.getSafesByOwner(
    //   ownerAddress
    // );
    const safeInfo: SafeInfoResponse = await safeService.getSafeInfo(
      // safes.safes[0]
      "0x209F31B1B54363d955FDE8dA8aEB0751ACd496A8"
    );
    const allTxs: SafeMultisigTransactionListResponse =
      await safeService.getAllTransactions(
        "0x209F31B1B54363d955FDE8dA8aEB0751ACd496A8"
      ); //safes.safes[0]);
    const txInfo: SafeMultisigTransactionResponse =
      await safeService.getTransaction(
        "0x4e7bd6ca6ce5e5b8f5ac8ff43e4c01f74b207a5fd00f285391be3c6d1db96f9c"
        // "0xa94804ed623c78773a8f8b74fe5e3ea5f6c1ebd882639f25d5221c693723df9c"
        // "0xb5ff885c7bc7132662c03c90c808178bf6f362c58eb27c3797f831a1576ddd76"
      ); //allTxs.results[3].safeTxHash);
    const multisigTxs: SafeMultisigTransactionListResponse =
      await safeService.getMultisigTransactions(
        "0x209F31B1B54363d955FDE8dA8aEB0751ACd496A8"
      );
    setSafeTxs(multisigTxs.results[1]);
    console.log(safeInfo, " ", allTxs, " ", multisigTxs, " ", txInfo);
    // console.log(safeInfo, " ", allTxs, " ", multisigTxs);
  };

  const noRefCheck = async (e) => {
    setSafeTxHash(e.target.value);
  };

  const fetchSafeDetails = async (safeAddr) => {
    const safeInfo: SafeInfoResponse = await safeService.getSafeInfo(safeAddr);

    const multisigTxs: SafeMultisigTransactionListResponse =
      await safeService.getMultisigTransactions(safeAddr);

    console.log(safeInfo, " ", multisigTxs);
  };

  const fetchSafeTxDetails = async () => {
    let txInfo: SafeMultisigTransactionResponse =
      await safeService.getTransaction(safeTxHash);
    setSafeTxs(txInfo);
  };

  return (
    <div className="w-full h-screen font-octosquare font-family-octosquare">
      <div className="flex flex-row mx-auto w-full sm:w-4/5 xl:w-1/3 justify-center my-12">
        <TextField
          id="outlined"
          label="Safe tx hash or Safe address"
          variant="outlined"
          onChange={(e) => noRefCheck(e)}
          value={safeTxHash}
          className="w-full"
        />
        <Button
          onClick={fetchSafeTxDetails}
          variant="outlined"
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </div>
      <div className="Plugins-list w-full sm:w-4/5 xl:w-1/3 mx-auto flex flex-col gap-8">
        {plugins.map((plugin) => (
          <Plugin address={plugin} />
          // <div>{JSON.stringify(plugin)}</div>
        ))}
      </div>
    </div>
  );
}

export default Plugins;
