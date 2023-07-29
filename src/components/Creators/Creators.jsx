import React, { useState, useEffect } from "react";
import {
  useMoralisQuery,
} from "react-moralis";
import { Card, Image, Tooltip, Modal, Badge, Alert, Spin } from "antd";
import {
  RightCircleOutlined,
} from "@ant-design/icons";
import {
  BrowserRouter as Router,
  NavLink,
} from "react-router-dom";

const { Meta } = Card;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
  banner: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: "0 auto",
    width: "600px",
    //borderRadius: "10px",
    height: "150px",
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "solid 1px #e3e3e3",
  },
  logo: {
    height: "115px",
    width: "115px",
    borderRadius: "50%",
    // positon: "relative",
    // marginTop: "-80px",
    border: "solid 4px white",
  },
  text: {
    color: "#041836",
    fontSize: "27px",
    fontWeight: "bold",
  },
};

const Creators = () => {
    const fallbackImg =
        "data:image/png;base64,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";
    const {data: creators, error, isLoading } = useMoralisQuery("WhitelistedCreators", 
    query => query.equalTo("confirmed",true));
    return (
        
        <div style={styles.NFTs}>
          {creators?.map((creator, index) => (
              <Card
                hoverable
                /*
                actions={[
                  <Tooltip title="View Collection">
                    <NavLink to={`/collections/${collection.attributes.contractAddr}`}>
                      <RightCircleOutlined
                        onClick={() => console.log("redirecting")}
                      />
                    </NavLink>  
                  </Tooltip>,
                ]}
                */
                style={{ width: 240, border: "2px solid #e7eaf3" }}
                cover={
                  <NavLink to={`/users/${creator?.attributes.creator}`}>
                    <Image
                      preview={false}
                      src={creator?.attributes?.Thumbnail || "error"}
                      fallback={fallbackImg}
                      alt=""
                      style={{ height: "240px" }}
                    />
                  </NavLink>
                }
                key={index}
              >
                <Meta title={creator?.attributes.name} description={creator?.attributes.creator}/>
              </Card>
            ))}

        </div>
    );
}

export default Creators;