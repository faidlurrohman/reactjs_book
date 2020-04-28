import React, { useState, useEffect } from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import { Form, Input, Button, Spin, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "../App.css";

export default function Login() {
  const [spinReg, setSpinReg] = useState(false);
  const history = useHistory();

  useEffect(() => {
    let userData = localStorage.getItem("user");
    if (userData !== null) {
      if (userData === "admin") {
        history.push("/admin");
      } else {
        history.push("/dashboard");
      }
    } else {
      history.push("/");
    }
  }, []);

  const onLogin = (values) => {
    fetch("http://127.0.0.1:8000/api/login", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        setSpinReg(true);
        return response.json();
      })
      .then((data) => {
        setTimeout(() => {
          setSpinReg(false);
          if (data !== "false") {
            if (data.name === "admin" && data.password === "admin") {
              localStorage.setItem("user", data.name);
              history.push("/admin");
            } else {
              localStorage.setItem("user", data.id);
              history.push("/dashboard");
            }
          } else {
            message.warning("Wrong username or password.");
            history.push("/");
          }
        }, 2000);
      });
  };

  if (spinReg === true) {
    return <Spin className="spin-register" size="large" />;
  }

  return (
    <Form name="normal_login" className="login-form" onFinish={onLogin}>
      <Form.Item className="header-container">
        <h4>Login User</h4>
      </Form.Item>
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Please input your Username!" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item className="container-button">
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        <Link to="/register" className="register-button">
          Register now!
        </Link>
      </Form.Item>
    </Form>
  );
}
