import React, { useCallback, useEffect, useContext, useState } from "react";
import { VideoCameraTwoTone, MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Form, Input, Button } from "antd";
import app from "./../../util/firebaseApp";
import { AuthContext } from "./../App/Auth";

const logoStyle = { fontSize: 44 };
const Login = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const redirects = useCallback(() => {
    if (currentUser) {
      history.push("/movies");
    } else {
      history.push("/login");
    }
  }, [currentUser, history]);

  useEffect(() => {
    currentUser && redirects();
  }, [currentUser, redirects]);

  const onFinish = useCallback(
    async (values) => {
      try {
        setLoading(true);
        const { email, password } = values;
        const result = await app.auth().signInWithEmailAndPassword(email, password);
        if (result.user.emailVerified) {
          history.push("/movies");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        alert(error);
      }
    },
    [history]
  );

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="gx-login-container">
      <div className="gx-login-box">
        <div className="gx-title-container">
          <Link to="/" className="gx-login-logo">
            <VideoCameraTwoTone style={logoStyle} />
            <h1>Ant Media</h1>
          </Link>
          <div className="gx-company-description">El estudio cinematográfico más influyente en el distrito Este.</div>
        </div>
        <div className="gx-form-container">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "¡Por favor ingresa tu correo!",
                },
                {
                  type: "email",
                  message: "Ingrese un correo valido.",
                },
              ]}
            >
              <Input prefix={<MailOutlined className="gx-prefix-icon" />} placeholder="Correo" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "¡Por favor ingresa tu contraseña!",
                },
              ]}
            >
              <Input.Password prefix={<LockOutlined className="gx-prefix-icon" />} placeholder="Contraseña" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Ingresar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
