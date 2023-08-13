// @ts-nocheck
import { Fragment, ReactNode, useState, useEffect } from "react";
import { truncateAddress } from "../../utils";
import { ethers, BigNumber } from "ethers";
import { useAccount, WagmiProvider, useChainId, useNetwork } from "wagmi";
import { config } from "../../config";
import ERC20 from "../../contracts/ABI/ERC20.json";
import Presale from "../../contracts/ABI/Presale.json";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { useRouter } from "next/router";
const fetch = require("node-fetch");
import { useEthersProvider, useEthersSigner } from "../../ethers";
import SafeApiKit from "@safe-global/api-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import {
  TextFieldInput,
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
import { getProvider } from "../../logic/web3";
import {
  loadPlugins,
  loadEnabledPlugins,
  enabledPluginsForAddress,
} from "../../logic/plugins";
import { getManager, getPlugin, getRegistry } from "../../logic/protocol";
import { getSafeInfo, isConnectedToSafe, submitTxs } from "../../logic/safeapp";
import { isModuleEnabled, buildEnableModule } from "../../logic/safe";
import { SafeInfo } from "./SafeInfo";

function Safe() {
  const [safeTxHash, setSafeTxHash] = useState(
    "0x209F31B1B54363d955FDE8dA8aEB0751ACd496A8"
  );
  const [safeTxs, setSafeTxs] = useState(null);
  const [safeDetails, setSafeDetails] = useState(null);
  const [enabledPlugins, setEnabledPlugins] = useState(null);

  let safeService;

  const setStartValues = async () => {
    const provider = await getProvider();
    // console.log(provider);
    // const safeOwner = provider.getSigner(0);

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: provider, //safeOwner,
    });

    safeService = new SafeApiKit({
      txServiceUrl: "https://safe-transaction-goerli.safe.global/", //"https://safe-transaction-polygon.safe.global/",
      ethAdapter,
    });
  };

  const noRefCheck = async (e) => {
    setSafeTxHash(e.target.value);
  };

  const fetchSafeDetails = async () => {
    const safeInfo: SafeInfoResponse = await safeService.getSafeInfo(
      safeTxHash
    );

    const multisigTxs: SafeMultisigTransactionListResponse =
      await safeService.getMultisigTransactions(safeTxHash);

    const serviceInfo: SafeServiceInfoResponse =
      await safeService.getServiceInfo();

    // const masterCopies: MasterCopyResponse =
    //   await safeService.getServiceMasterCopiesInfo();

    const temporaryEnabledPlugins = await enabledPluginsForAddress(safeTxHash);

    console.log(safeInfo, " ", multisigTxs, " ", temporaryEnabledPlugins, " ");
    setSafeDetails(safeInfo);
    setSafeTxs(multisigTxs.results);
    setEnabledPlugins(temporaryEnabledPlugins);
  };

  const fetchSafeTxDetails = async () => {
    let txInfo: SafeMultisigTransactionResponse =
      await safeService.getTransaction(safeTxHash);
    setSafeTxs(txInfo);
  };

  useEffect(() => {
    // fetchSafeDetails("");
    // initializeDapp();
    setStartValues();
  }, []);

  return (
    <div className="w-view h-screen font-octosquare font-family-octosquare">
      <div className="flex flex-row mx-auto w-full md:w-5/6 xl:w-1/2 justify-center my-12">
        <TextField
          id="outlined"
          label="Safe tx hash or Safe address"
          variant="outlined"
          onChange={(e) => noRefCheck(e)}
          value={safeTxHash}
          className="w-full"
        />
        <Button
          onClick={fetchSafeDetails}
          variant="outlined"
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </div>

      {safeDetails && (
        <div className="w-full md:w-5/6 xl:w-1/2 mx-auto">
          <SafeInfo safe={safeDetails} plugins={enabledPlugins} />

          <TableContainer component={Paper} className="">
            <Table
              // maxWidth="lg"
              sx={{ maxWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(safeDetails).map((row) => (
                  <TableRow
                    key={row}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row}:
                    </TableCell>
                    <TableCell align="left">
                      {JSON.stringify(safeDetails[row])}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TableContainer component={Paper} className="">
            <Table
              // maxWidth="lg"
              sx={{ maxWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(safeTxs).map((row) => (
                  <TableRow
                    key={row}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row}:
                    </TableCell>
                    <TableCell align="left">
                      {JSON.stringify(safeTxs[row])}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}

export default Safe;
