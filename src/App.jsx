import { useEffect, useState} from "react";
import { useMoralis, useChain } from "react-moralis";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import Account from "components/Account";
import Chains from "components/Chains";
import NFTBalance from "components/NFTBalance";
import Collections from "components/Collections/Collections";
import Collection from "components/Collections/Collection";
import CreateCollection from "components/Collections/CreateCollection";
import Creators from "components/Creators/Creators";
import Creator from "components/Creators/Creator";
import UserProfile from "components/Users/UserProfile";
import NFT from "components/NFTs/NFT";
import WhitelistCreator from "components/Admin/Whitelist";
import Onramp from "components/Onramp";

import { Menu, Layout} from "antd";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import Text from "antd/lib/typography/Text";
//import NFTMarketTransactions from "components/NFTMarketTransactions";
const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};



const App = () => {
  const { Moralis, isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <Menu
            theme="light"
            mode="horizontal"
            style={{
              display: "flex",
              fontSize: "17px",
              fontWeight: "500",
              marginLeft: "50px",
              width: "100%",
            }}
            defaultSelectedKeys={["whitelist"]}
          >
            <Menu.Item key="collections" >
              <NavLink to="collections">🛒 Collections</NavLink>
            </Menu.Item>
            <Menu.Item key="nft">
              <NavLink to="nftBalance">🖼 Your NFTs</NavLink>
            </Menu.Item>
            <Menu.Item key="createCollection">
              <NavLink to="createCollection">Create Collection</NavLink>
            </Menu.Item>
            <Menu.Item key="whitelist">
              <NavLink to="whitelist">Creator Whitelist</NavLink>
            </Menu.Item>
            <Menu.Item key="creators">
              <NavLink to="creators">Creators</NavLink>
            </Menu.Item>
            { isAuthenticated && 
            <Menu.Item key="users/:userId">
              <NavLink to={"users/"+Moralis.User.current().attributes.ethAddress}>My Profile</NavLink>
            </Menu.Item>
            }
          </Menu>
          <div style={styles.headerRight}>
            <Chains />
            <NativeBalance />
            <Account />
            
          </div>
        </Header>
        <div style={styles.content}>
          <Routes>
            <Route path="whitelist" element={<WhitelistCreator/>} />
            <Route path="nftBalance" element={<NFTBalance/>} />
            <Route path="createCollection" element={<CreateCollection />} />
            <Route path="collections" element={<Collections/>} />
            <Route path="collections/:collectionId" element={<Collection/>} />
            <Route path="collections/:collectionId/:tokenId" element={<NFT/>} />
            <Route path="creators" element={<Creators />} />
            <Route path="users/:userId" element={<UserProfile />} />
            <Route path="onramp" element={<Onramp />} />
          </Routes>
        </div>
      </Router>
      <Footer style={{ textAlign: "center" }}>
        <Text style={{ display: "block" }}>
          Footer text *PENDIENTE*
        </Text>
      </Footer>
    </Layout>
  );
};

export default App;
