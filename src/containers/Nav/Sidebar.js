import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import { CalendarOutlined, DashboardOutlined, PoweroffOutlined, VerifiedOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";

import app from "./../../util/firebaseApp";

const { Sider } = Layout;

const sidebarStyle = {
  overflow: "auto",
  height: "100vh",
  position: "fixed",
  left: 0,
};

const SidebarAnt = (props) => {
  const { collapsed, onCollapse } = props;
  let location = useLocation();
  let selectedKeys = location?.pathname.substr(1);
  let defaultOpenKeys = selectedKeys?.split("/")[1];
  const onClose = () => {
    app.auth().signOut();
  };

  return (
    <Sider style={sidebarStyle} collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="gx-logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[defaultOpenKeys]} selectedKeys={selectedKeys}>
        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="movies" icon={<VideoCameraOutlined />}>
          <Link to="/movies">Películas</Link>
        </Menu.Item>
        <Menu.Item key="turns" icon={<CalendarOutlined />}>
          <Link to="/turns">Turnos</Link>
        </Menu.Item>
        <Menu.Item key="admins" icon={<VerifiedOutlined />}>
          <Link to="/admins">Administradores</Link>
        </Menu.Item>
        <Menu.Item key="profile" icon={<UserOutlined />}>
          <Link to="/profile">Perfil</Link>
        </Menu.Item>
        <Menu.Item key="close" icon={<PoweroffOutlined />} onClick={onClose}>
          Cerrar Sesión
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SidebarAnt;
