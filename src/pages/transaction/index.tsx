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
  ExplorerButton,
} from "@safe-global/safe-react-components";
import { Input, TextField, IconButton, Card } from "@mui/material";
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
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { DataGrid } from "@mui/x-data-grid";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function SafeTransaction() {
  const [safeTxHash, setSafeTxHash] = useState(
    "0x4e7bd6ca6ce5e5b8f5ac8ff43e4c01f74b207a5fd00f285391be3c6d1db96f9c"
  );
  const [safeTxs, setSafeTxs] = useState(null);
  const [safeService, setSafeService] = useState(null);
  const [tabValue, setTabValue] = useState(0);

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
    console.log(txInfo);
    setSafeTxs(txInfo);
  };

  useEffect(() => {
    // fetchSafeDetails("");
    // initializeDapp();
    setStartValues();
  }, []);

  return (
    <div className="w-view h-screen font-octosquare font-family-octosquare">
      <div className="flex flex-row mx-auto w-full md:w-5/6 xl:w-2/3 justify-center mt-12">
        <TextField
          id="outlined"
          label="Safe tx hash"
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

      {safeTxs ? (
        <>
          <div className="border border-[#12FF80] rounded-md my-4 w-full md:w-5/6 xl:w-2/3 mx-auto">
            <Card className="flex flex-col items-center justify-between p-2 border border-[#12FF80] rounded-md">
              <div className="text-lg font-medium flex mt-2 mb-4">
                Tx Details
              </div>
              {/* <Accordion>
            <AccordionSummary>
              <Typography>Accordion 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </div>
            </AccordionDetails>
          </Accordion> */}
              <div className="mx-auto flex flex-col items-center justify-center w-full px-8">
                {/* <div className="text-sm font-medium flex mt-2 mb-4 self-start w-full">
                Latest {safeTxs?.length} transactions
              </div> */}
                <div className="w-full mx-auto">
                  <Card className="Plugin flex flex-col items-center justify-between p-2">
                    <div className="text-lg font-medium flex mt-2 mb-4">
                      Overview
                    </div>
                    <div className="w-full flex flex-col gap-4 items-start justify-around mx-8 divide-y-2">
                      <div className="flex w-full items-center justify-between pt-2">
                        <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2">
                          <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                          <div className="text-md font-medium flex">From:</div>
                        </div>
                        <div className="w-full flex justify-end">
                          <EthHashInfo
                            address={safeTxs.safe}
                            showCopyButton
                            shortAddress={false}
                          />
                        </div>
                      </div>

                      <div className="flex w-full items-center justify-between pt-2">
                        <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2">
                          <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                          <div className="text-md font-medium flex">To:</div>
                        </div>
                        <div className="w-full flex justify-end">
                          <EthHashInfo
                            address={safeTxs.to}
                            showCopyButton
                            shortAddress={false}
                          />
                        </div>
                      </div>

                      <div className="flex w-full items-center justify-between pt-2">
                        <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2">
                          <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                          <div className="text-md font-medium flex">
                            Safe Tx Hash:
                          </div>
                        </div>
                        <div className="w-full flex justify-end">
                          <EthHashInfo
                            address={safeTxs.safeTxHash}
                            showCopyButton
                            shortAddress={false}
                          />
                        </div>
                      </div>

                      <div className="flex w-full items-center justify-between pt-2">
                        <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2">
                          <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                          <div className="text-md font-medium flex">
                            Transaction Hash:
                          </div>
                        </div>
                        <div className="w-full flex justify-end">
                          <EthHashInfo
                            address={safeTxs.transactionHash}
                            showCopyButton
                            shortAddress={false}
                          />
                        </div>
                      </div>

                      <div className="flex w-full  items-center justify-center pb-4 pt-6">
                        <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2 ">
                          <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                          <div className="text-md font-medium flex ">
                            Confirmations:
                          </div>
                        </div>
                        <div className="w-full flex flex-col gap-2  items-end">
                          {safeTxs.confirmations.map((confirmation) => (
                            <>
                              <EthHashInfo
                                address={confirmation.owner}
                                showCopyButton
                                shortAddress={false}
                              />
                              <div className="text-md font-medium flex ">
                                {confirmation.submissionDate}
                              </div>
                            </>
                          ))}
                        </div>
                      </div>

                      {/* <div className="flex w-full items-center justify-center pt-2">
                        <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2 ">
                          <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                          <div className="text-md font-medium flex ">
                            Treshold:
                          </div>
                        </div>

                        <div className="w-full flex justify-end pr-8">
                          {safe.threshold} / {safe.owners.length} owners
                        </div>
                      </div> */}

                      {/* <div className="flex w-full  items-center justify-center pb-4 pt-6">
                        <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2 ">
                          <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                          <div className="text-md font-medium flex ">
                            Owners:
                          </div>
                        </div>
                        <div className="w-full flex flex-col gap-2  items-end">
                          {safe.owners.map((owner) => (
                            <EthHashInfo
                              address={owner}
                              showCopyButton
                              shortAddress={false}
                            />
                          ))}
                        </div>
                      </div> */}
                    </div>
                  </Card>
                </div>
              </div>
              <div className="w-full h-fit mx-auto self-center flex items-center justify-center">
                <div className="text-sm inline-block bg-stone-800 rounded-md p-2">
                  Signature:
                  <EthHashInfo
                    address={safeTxs.signatures}
                    showCopyButton
                    showAvatar={false}
                    shortAddress={false}
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="border border-[#12FF80] rounded-md my-4 w-full md:w-5/6 xl:w-2/3 mx-auto">
            <Card className="flex flex-col items-center justify-between p-2 border border-[#12FF80] rounded-md">
              <div className="text-lg font-medium flex mt-2 mb-4">Advanced</div>
              {/* <Accordion>
            <AccordionSummary>
              <Typography>Accordion 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </div>
            </AccordionDetails>
          </Accordion> */}
              <div className="mx-auto flex flex-col items-center justify-center w-full px-8">
                {/* <div className="text-sm font-medium flex mt-2 mb-4 self-start w-full">
                Latest {safeTxs?.length} transactions
              </div> */}
                <div className="w-full mx-auto">
                  <TableContainer component={Paper} className="">
                    <Table
                      // maxWidth="lg"
                      // sx={{ maxWidth: 650 }}
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
                          <>
                            {row == "value" ||
                            row == "operation" ||
                            row == "gasToken" ||
                            row == "safeTxGas" ||
                            row == "baseGas" ||
                            row == "gasPrice" ||
                            row == "refundReceiver" ||
                            row == "nonce" ||
                            row == "executor" ||
                            row == "ethGasPrice" ||
                            row == "maxFeePerGas" ||
                            row == "maxPriorityFeePerGas" ||
                            row == "gasUsed" ||
                            row == "fee" ||
                            row == "trusted" ? (
                              <TableRow
                                key={row}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {row}:
                                </TableCell>
                                <TableCell align="left">
                                  {safeTxs[row]}
                                  {row == "trusted" ? (
                                    <>{JSON.stringify(safeTxs[row])}</>
                                  ) : (
                                    ""
                                  )}
                                </TableCell>
                              </TableRow>
                            ) : (
                              ""
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                {/* <Table
                // maxWidth="lg"
                // sx={{ maxWidth: 650 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>SafeTxHash</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Confirmations</TableCell>
                    <TableCell>Block Number</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    key={safeTxs.safeTxHash}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <EthHashInfo
                        address={safeTxs.safeTxHash}
                        showCopyButton
                        showAvatar={false}
                        shortAddress={true}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <EthHashInfo
                        address={safeTxs.to}
                        showCopyButton
                        showAvatar={false}
                        shortAddress={true}
                      />
                    </TableCell>
                    <TableCell align="left">
                      {ethers.formatEther(safeTxs.value)}
                    </TableCell>
                    <TableCell align="left">
                      {safeTxs.confirmations.length} /{" "}
                      {safeTxs.confirmationsRequired}
                    </TableCell>
                    <TableCell align="left">{safeTxs.blockNumber}</TableCell>
                    <TableCell align="left">
                      <div className="bg-[#473e3e] rounded-md px-2 py-1 text-xs text-[#12FF80]">
                        {safeTxs.isExecuted ? "Executed" : "Pending"}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        onClick={fetchSafeDetails}
                        variant="outlined"
                        // startIcon={<SearchIcon />}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table> */}
              </div>
            </Card>
          </div>
        </>
      ) : (
        ""
      )}

      {/* {safeTxs && (
        <div className="w-2/3 mx-auto">
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
      )} */}
    </div>
  );
}

export default SafeTransaction;
