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
import { Button, Card, Tooltip } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import {
  EthHashInfo,
  SafeThemeProvider,
} from "@safe-global/safe-react-components";

type PluginMetaProps = {
  metadata: PluginMetadata;
};

const PluginMeta: FunctionComponent<PluginMetaProps> = ({ metadata }) => {
  return (
    <>
      {metadata.name} - {metadata.version}
    </>
  );
};

type PluginProps = {
  address: string;
};

export const Plugin: FunctionComponent<PluginProps> = ({ address }) => {
  const [details, setDetails] = useState<PluginDetails | undefined>(undefined);
  const blocky = blockies.create({ seed: address }).toDataURL();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pluginDetails = await loadPluginDetails(address);
        console.log(address, " ", pluginDetails);
        setDetails(pluginDetails);
      } catch (e) {
        console.warn(e);
      }
    };
    fetchData();
  }, [address]);

  const handleToggle = useCallback(async () => {
    if (details?.enabled === undefined) return;
    try {
      if (details.enabled) await disablePlugin(address);
      else await enablePlugin(address, details.metadata.requiresRootAccess);
    } catch (e) {
      console.warn(e);
    }
  }, [details]);
  return (
    <div className="border border-[#12FF80] rounded-md">
      <Card
        className="Plugin flex items-center justify-between p-2"
        // id="outlined"
      >
        <Tooltip title={address}>
          <EthHashInfo address={address} showCopyButton shortAddress={true} />
        </Tooltip>
        <div className="Plugin-title w-full h-16 flex flex-col items-center justify-center mx-8">
          {!details ? (
            <LinearProgress sx={{ alignSelf: "stretch" }} />
          ) : (
            <PluginMeta metadata={details.metadata} />
            // <div>{JSON.stringify(details?.metadata)}</div>
          )}
        </div>
      </Card>
    </div>
  );
};
