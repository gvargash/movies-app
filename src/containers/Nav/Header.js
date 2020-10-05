import React, { useContext } from "react";
import { Layout, Menu, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AuthContext } from "./../App/Auth";
const { Header } = Layout;

const HeaderAnt = (props) => {
  const { currentUser } = useContext(AuthContext);
  console.log("HeaderAnt -> currentUser", currentUser?.displayName);
  return (
    <Header className="gx-site-layout-background" style={{ padding: 0 }}>
      <Menu mode="horizontal" className="gx-f-right">
        <Menu.Item key="mail" icon={<Avatar icon={<UserOutlined />} />}>
          <span style={{ marginLeft: 4 }}>{currentUser?.displayName}</span>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

HeaderAnt.propTypes = {};

export default HeaderAnt;
