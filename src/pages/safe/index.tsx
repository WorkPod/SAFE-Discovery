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

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "safeTxHash", headerName: "safeTxHash", width: 130 },
  // { field: "lastName", headerName: "Last name", width: 130 },
  // {
  //   field: "age",
  //   headerName: "Age",
  //   type: "number",
  //   width: 90,
  // },
  // {
  //   field: "fullName",
  //   headerName: "Full name",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  // },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

function Safe() {
  const [safeTxHash, setSafeTxHash] = useState(
    "0x209F31B1B54363d955FDE8dA8aEB0751ACd496A8"
  );
  const [safeTxs, setSafeTxs] = useState([]);
  const [pendingTxs, setPendingTxs] = useState([]);
  const [incomingTxs, setIncomingTxs] = useState([]);
  const [moduleTxs, setModuleTxs] = useState([]);
  const [allTxs, setAllTxs] = useState([]);
  const [safeDetails, setSafeDetails] = useState(null);
  const [enabledPlugins, setEnabledPlugins] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

    const incomingTxs: TransferListResponse =
      await safeService.getIncomingTransactions(safeTxHash);

    const moduleTxs: SafeModuleTransactionListResponse =
      await safeService.getModuleTransactions(safeTxHash);

    const pendingTxs: SafeMultisigTransactionListResponse =
      await safeService.getPendingTransactions(safeTxHash);

    // const pendingTxs: SafeMultisigTransactionListResponse =
    //   await safeService.getPendingTransactions(safeAddress, currentNonce);

    const allTxs: SafeMultisigTransactionListResponse =
      await safeService.getAllTransactions(safeTxHash);
    // const allTxsOptions: AllTransactionsOptions = {
    //   executed,
    //   queued,
    //   trusted,
    // };
    // const allTxsOptioned: SafeMultisigTransactionListResponse =
    //   await safeService.getAllTransactions(safeTxHash, allTxsOptions);

    const temporaryEnabledPlugins = await enabledPluginsForAddress(safeTxHash);

    console.log(
      safeInfo,
      " ",
      multisigTxs,
      " ",
      temporaryEnabledPlugins,
      " ",
      " ",
      incomingTxs,
      " ",
      moduleTxs,
      " ",
      " ",
      pendingTxs,
      " ",
      allTxs,
      " "
      // allTxsOptioned
    );
    setSafeDetails(safeInfo);
    setSafeTxs(multisigTxs.results);
    setPendingTxs(pendingTxs.results);
    setIncomingTxs(incomingTxs.results);
    setModuleTxs(moduleTxs.results);
    setAllTxs(allTxs.results);
    setEnabledPlugins(temporaryEnabledPlugins);
    // const mappedTxs = multisigTxs.results.map((obj, index) => ({
    //   id: index,
    //   safeTxHash: obj.safeTxHash,
    // }));
    // console.log(mappedTxs);
    // setSimpleTxs(mappedTxs);
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
      <div className="flex flex-row mx-auto w-full md:w-5/6 xl:w-2/3 justify-center my-12">
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
        <div className="w-full md:w-5/6 xl:w-2/3 mx-auto">
          <SafeInfo safe={safeDetails} plugins={enabledPlugins} />

          <div className="border border-[#12FF80] rounded-md my-4">
            <Card className="flex flex-col items-center justify-between p-2 border border-[#12FF80] rounded-md">
              <div className="text-lg font-medium flex mt-2 mb-4">
                Transactions
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
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="basic tabs example"
                  >
                    <Tab label="From Multisig" {...a11yProps(0)} />
                    <Tab label="Pending" {...a11yProps(1)} />
                    <Tab label="Incoming " {...a11yProps(2)} />
                    {/* <Tab label="Modules" {...a11yProps(3)} /> */}
                    <Tab label="All" {...a11yProps(3)} />
                  </Tabs>
                </Box>
                <CustomTabPanel value={tabValue} index={0}>
                  {safeTxs?.length > 0 ? (
                    <div className="mx-auto flex flex-col items-center justify-center">
                      <div className="text-sm font-medium flex mt-2 mb-4 self-start">
                        Latest {safeTxs?.length} transactions
                      </div>
                      <Table
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
                          {safeTxs.map((tx) => (
                            <TableRow
                              key={tx.safeTxHash}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <EthHashInfo
                                  address={tx.safeTxHash}
                                  showCopyButton
                                  showAvatar={false}
                                  shortAddress={true}
                                />
                              </TableCell>
                              <TableCell align="left">
                                <EthHashInfo
                                  address={tx.to}
                                  showCopyButton
                                  showAvatar={false}
                                  shortAddress={true}
                                />
                              </TableCell>
                              <TableCell align="left">
                                {ethers.formatEther(tx.value)}
                              </TableCell>
                              <TableCell align="left">
                                {tx.confirmations.length} /{" "}
                                {safeDetails.owners.length}
                              </TableCell>
                              <TableCell align="left">
                                {tx.blockNumber}
                              </TableCell>
                              <TableCell align="left">
                                <div className="bg-[#473e3e] rounded-md pl-3 py-1 text-xs text-[#12FF80]">
                                  {tx.isExecuted ? "Executed" : "Pending"}
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
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-sm font-medium flex mt-2 mb-4">
                      The list is empty
                    </div>
                  )}
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                  {pendingTxs?.length > 0 ? (
                    <div className="mx-auto flex flex-col items-center justify-center">
                      <div className="text-sm font-medium flex mt-2 mb-4 self-start">
                        Latest {pendingTxs?.length} transactions
                      </div>
                      <Table
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
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pendingTxs.map((tx) => (
                            <TableRow
                              key={tx.safeTxHash}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <EthHashInfo
                                  address={tx.safeTxHash}
                                  showCopyButton
                                  showAvatar={false}
                                  shortAddress={true}
                                />
                              </TableCell>
                              <TableCell align="left">
                                <EthHashInfo
                                  address={tx.to}
                                  showCopyButton
                                  showAvatar={false}
                                  shortAddress={true}
                                />
                              </TableCell>
                              <TableCell align="left">
                                {ethers.formatEther(tx.value)}
                              </TableCell>
                              <TableCell align="left">
                                {tx.confirmations.length} /{" "}
                                {safeDetails.owners.length}
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
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-sm font-medium flex mt-2 mb-4">
                      The list is empty
                    </div>
                  )}
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={2}>
                  {incomingTxs?.length > 0 ? (
                    <div className="mx-auto flex flex-col items-center justify-center">
                      <div className="text-sm font-medium flex mt-2 mb-4 self-start">
                        Latest {incomingTxs?.length} transactions
                      </div>
                      <Table
                        // maxWidth="lg"
                        // sx={{ maxWidth: 650 }}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Transaction Hash</TableCell>
                            <TableCell>From</TableCell>
                            {/* <TableCell>To</TableCell> */}
                            <TableCell>Type</TableCell>
                            <TableCell>Token</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Block Number</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {incomingTxs.map((tx) => (
                            <TableRow
                              key={tx.safeTxHash}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <EthHashInfo
                                  address={tx.transactionHash}
                                  showCopyButton
                                  showAvatar={false}
                                  shortAddress={true}
                                />
                              </TableCell>
                              <TableCell align="left">
                                <EthHashInfo
                                  address={tx.from}
                                  showCopyButton
                                  showAvatar={false}
                                  shortAddress={true}
                                />
                              </TableCell>
                              {/* <TableCell align="left">
                                <EthHashInfo
                                  address={tx.to}
                                  showCopyButton
                                  showAvatar={false}
                                  shortAddress={true}
                                />
                              </TableCell> */}
                              <TableCell align="left">{tx.type}</TableCell>
                              <TableCell align="left">
                                {tx.type == "ERC20_TRANSFER" ? (
                                  <>{tx.tokenInfo.name}</>
                                ) : (
                                  ""
                                )}
                                {tx.type == "ETHER_TRANSFER" ? "ETHER" : ""}
                              </TableCell>
                              <TableCell align="left">
                                {tx.type == "ERC20_TRANSFER"
                                  ? ethers.formatUnits(
                                      tx.value,
                                      tx.tokenInfo.decimals
                                    )
                                  : ""}
                                {tx.type == "ETHER_TRANSFER"
                                  ? ethers.formatUnits(tx.value)
                                  : ""}
                              </TableCell>
                              <TableCell align="left">
                                {tx.blockNumber}
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
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-sm font-medium flex mt-2 mb-4">
                      The list is empty
                    </div>
                  )}
                </CustomTabPanel>
                {/* <CustomTabPanel value={tabValue} index={3}>
                  Item Three
                </CustomTabPanel> */}
                <CustomTabPanel value={tabValue} index={3}>
                  {allTxs?.length > 0 ? (
                    <div className="mx-auto flex flex-col items-center justify-center">
                      <div className="text-sm font-medium flex mt-2 mb-4 self-start">
                        Latest {allTxs?.length} transactions
                      </div>
                      <Table
                        // maxWidth="lg"
                        // sx={{ maxWidth: 650 }}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Transaction Hash</TableCell>
                            <TableCell>Safe Transaction Hash</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Block Number</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {allTxs.map((tx) => (
                            <TableRow
                              key={tx.safeTxHash}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {tx.transactionHash ? (
                                  <EthHashInfo
                                    address={tx.transactionHash}
                                    showCopyButton
                                    showAvatar={false}
                                    shortAddress={true}
                                  />
                                ) : (
                                  ""
                                )}
                                {tx.txHash ? (
                                  <EthHashInfo
                                    address={tx.txHash}
                                    showCopyButton
                                    showAvatar={false}
                                    shortAddress={true}
                                  />
                                ) : (
                                  ""
                                )}
                                {!tx.txHash && !tx.transactionHash
                                  ? "Pending"
                                  : ""}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {tx.safeTxHash ? (
                                  <EthHashInfo
                                    address={tx.safeTxHash}
                                    showCopyButton
                                    showAvatar={false}
                                    shortAddress={true}
                                  />
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {tx.from ? (
                                  <EthHashInfo
                                    address={tx.from}
                                    showCopyButton
                                    showAvatar={false}
                                    shortAddress={true}
                                  />
                                ) : (
                                  ""
                                )}
                                {tx.safe ? (
                                  <EthHashInfo
                                    address={tx.safe}
                                    showCopyButton
                                    showAvatar={false}
                                    shortAddress={true}
                                  />
                                ) : (
                                  ""
                                )}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {tx.to ? (
                                  <EthHashInfo
                                    address={tx.to}
                                    showCopyButton
                                    showAvatar={false}
                                    shortAddress={true}
                                  />
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {tx.blockNumber ? <>{tx.blockNumber}</> : "N/A"}
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
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-sm font-medium flex mt-2 mb-4">
                      The list is empty
                    </div>
                  )}
                </CustomTabPanel>
              </Box>
            </Card>
          </div>

          {/* <TableContainer component={Paper} className="">
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
          </TableContainer> */}

          {/* <TableContainer component={Paper} className="">
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
                {Object.keys(safeTxs[0]).map((row) => (
                  <TableRow
                    key={row}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row}:
                    </TableCell>
                    <TableCell align="left">
                      {JSON.stringify(safeTxs[0][row])}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}
        </div>
      )}
    </div>
  );
}

export default Safe;
