import React, { useState } from "react";
import { Layout, Spin } from "antd";
import { format } from "date-fns";
import { dateFormatList } from "./../../util/config";
import App from "./../../routes/index";
import SidebarAnt from "./../Nav/Sidebar";
import HeaderAnt from "./../Nav/Header";

const { Content, Footer } = Layout;

const MainApp = (props) => {
  const { match } = props;
  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = (collapsed) => setCollapsed(collapsed);
  return (
    <Spin spinning={false}>
      <Layout style={{ minHeight: "100vh" }}>
        <SidebarAnt onCollapse={onCollapse} collapsed={collapsed} />
        <Layout className="gx-main-container-wrapper" style={{ marginLeft: collapsed ? 80 : 200 }}>
          <HeaderAnt />
          <Content className="gx-layout-background">
            <App match={match} />
          </Content>
          <Footer style={{ textAlign: "center" }}>Copyright &copy; {format(new Date(), dateFormatList[0])} Ant Media.</Footer>
        </Layout>
      </Layout>
    </Spin>
  );
};

export default MainApp;
