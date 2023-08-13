import { FunctionComponent, useCallback, useEffect, useState } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import * as blockies from "blockies-ts";
// import "./Plugins.css";
import { PluginMetadata } from "../../logic/metadata";
import {
  PluginDetails,
  disablePlugin,
  enablePlugin,
  loadPluginDetails,
} from "../../logic/plugins";
import { openSafeApp } from "../../logic/safeapp";
import {
  Button,
  Card,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import {
  EthHashInfo,
  SafeThemeProvider,
} from "@safe-global/safe-react-components";
import { loadPlugins, loadEnabledPlugins } from "../../logic/plugins";
import { getManager, getPlugin, getRegistry } from "../../logic/protocol";
import { getSafeInfo, isConnectedToSafe, submitTxs } from "../../logic/safeapp";
import { isModuleEnabled, buildEnableModule } from "../../logic/safe";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

export const SafeInfo = ({ safe, plugins }) => {
  const [details, setDetails] = useState<PluginDetails | undefined>(undefined);

  const setStartValues = async () => {
    // let en = await loadEnabledPlugins();
    // let en =
    console.log("b");

    // const manager = await getManager();
    // const safeInfo = await getSafeInfo();
    // console.log(manager, " ", safeInfo);
  };

  useEffect(() => {
    console.log("a");
    setStartValues();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-[#12FF80] rounded-md">
        <Card className="Plugin flex flex-col items-center justify-between p-2">
          <div className="text-lg font-medium flex mt-2 mb-4">Overview</div>
          <div className="w-full flex flex-col gap-4 items-start justify-around mx-8 divide-y-2">
            <div className="flex w-full items-center justify-between pt-2">
              <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2">
                <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                <div className="text-md font-semibold flex">Safe Address:</div>
              </div>
              <div className="w-full flex justify-end">
                <EthHashInfo
                  address={safe.address}
                  showCopyButton
                  shortAddress={false}
                />
              </div>
            </div>

            <div className="flex w-full items-center justify-center pt-2">
              <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2 ">
                <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                <div className="text-md font-semibold flex ">Treshold:</div>
              </div>

              <div className="w-full flex justify-end pr-8">
                {safe.threshold} / {safe.owners.length} owners
              </div>
            </div>

            <div className="flex w-full  items-center justify-center pb-4 pt-6">
              <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2 ">
                <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                <div className="text-md font-semibold flex ">Owners:</div>
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
            </div>
          </div>
        </Card>
      </div>

      <div className="border border-[#12FF80] rounded-md">
        <Card className="Plugin flex flex-col items-center justify-between p-2">
          <div className="text-lg font-medium flex mt-2 mb-4">Details</div>
          <div className="w-full flex flex-col gap-4 items-start justify-around mx-8 divide-y-2">
            <div className="flex w-full items-center justify-center pt-2">
              <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2 ">
                <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                <div className="text-md font-semibold flex ">Guard</div>
              </div>

              <div className="w-full flex justify-end">
                <EthHashInfo
                  address={safe.guard}
                  showCopyButton
                  shortAddress={false}
                />
              </div>
            </div>

            <div className="flex w-full  items-center justify-center pb-4 pt-6">
              <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2 ">
                <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                <div className="text-md font-semibold flex ">Modules:</div>
              </div>
              <div className="w-full flex flex-col gap-2 items-end">
                {safe.modules.map((module) => (
                  <EthHashInfo
                    address={module}
                    showCopyButton
                    shortAddress={false}
                  />
                ))}
              </div>
            </div>

            <div className="flex w-full  items-center justify-center pb-4 pt-6">
              <div className="h-16 flex gap-2 items-center justify-start mx-8 w-1/2 ">
                <AccountBalanceWalletOutlinedIcon className="w-16 h-16" />
                <div className="text-md font-semibold flex ">
                  Enabled Plugins:
                </div>
              </div>
              <div className="w-full flex flex-col gap-2 items-end">
                {plugins.map((plugin) => (
                  <EthHashInfo
                    address={plugin}
                    showCopyButton
                    shortAddress={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
