// @ts-nocheck
import { Fragment, ReactNode, useState, useEffect } from "react";
import { truncateAddress } from "../../utils";
import { ethers, BigNumber } from "ethers";
import { useAccount, WagmiProvider, useChainId, useNetwork } from "wagmi";
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

function SafeTransaction() {
  const [safeTxHash, setSafeTxHash] = useState(
    "0x4e7bd6ca6ce5e5b8f5ac8ff43e4c01f74b207a5fd00f285391be3c6d1db96f9c"
  );
  const [safeTxs, setSafeTxs] = useState(null);
  const [safeService, setSafeService] = useState(null);

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

  useEffect(() => {
    // fetchSafeDetails("");
    // initializeDapp();
    setStartValues();
  }, []);

  return (
    <div className="w-view h-screen font-octosquare font-family-octosquare">
      <div className="flex flex-row mx-auto w-full justify-center mt-12">
        <TextField
          id="outlined"
          label="Safe tx hash"
          variant="outlined"
          onChange={(e) => noRefCheck(e)}
          value={safeTxHash}
          className="w-[358px]"
        />
        <Button
          onClick={fetchSafeTxDetails}
          variant="outlined"
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </div>
      {/* <EthHashInfo address={"bingus"} showCopyButton shortAddress={false} /> */}
      <h1 className="mx-auto">API Response Data</h1>
      {safeTxs && (
        <div className="w-1/2 mx-auto">
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

export default SafeTransaction;
