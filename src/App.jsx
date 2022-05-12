import { useEffect, useState} from "react";
import { useMoralis } from "react-moralis";
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
import NFTMinter from "components/NFTMinter";
import CreateCollection from "components/Collections/CreateCollection";
import { Menu, Layout} from "antd";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import Text from "antd/lib/typography/Text";
import NFTMarketTransactions from "components/NFTMarketTransactions";
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
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
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
            defaultSelectedKeys={["nftMarket"]}
          >
            <Menu.Item key="collections" >
              <NavLink to="collections">🛒 Collections</NavLink>
            </Menu.Item>
            <Menu.Item key="nft">
              <NavLink to="nftBalance">🖼 Your NFTs</NavLink>
            </Menu.Item>
            <Menu.Item key="transactions">
              <NavLink to="transactions">📑 Your Transactions</NavLink>
            </Menu.Item>
            <Menu.Item key="minter">
              <NavLink to="nftMinter">Mint new NFT</NavLink>
            </Menu.Item>
            <Menu.Item key="createCollection">
              <NavLink to="createCollection">Create Collection</NavLink>
            </Menu.Item>
          </Menu>
          <div style={styles.headerRight}>
            <Chains />
            <NativeBalance />
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Routes>
            <Route path="nftBalance" element={<NFTBalance/>} />
            <Route path="transactions" element={<NFTMarketTransactions/>} />
            <Route path="nftMinter" element={<NFTMinter/>} />
            <Route path="createCollection" element={<CreateCollection />} />

            <Route path="collections" element={<Collections/>} />
            <Route path="collections/:collectionId" element={<Collection/>} />
  
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
