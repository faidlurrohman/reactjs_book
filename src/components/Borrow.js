import React, { useEffect, useState } from "react";
import { List, Divider, Button, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import "../App.css";

const { confirm } = Modal;

export default function Borrow() {
  const history = useHistory();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    let userData = localStorage.getItem("user");
    if (userData !== null) {
      if (userData === "admin") {
        history.push("/borrow");
      } else {
        history.push("/dashboard");
      }
    } else {
      history.push("/");
    }
    getBooks();
  }, []);

  const getBooks = () => {
    fetch("http://127.0.0.1:8000/api/borrowsNotConfirm")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBooks(data.reverse());
      });
  };

  //accept
  const acceptRequest = (id) => {
    confirm({
      title: "Are you sure wanna to accept this borrow request?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        fetch("http://127.0.0.1:8000/api/acceptBorrow/" + id, {
          method: "put",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            confirmed: true,
          }),
        }).then((response) => {
          message.success("Request accepted.");
          getBooks();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  //decline
  const declineRequest = (id, book_id) => {
    confirm({
      title: "Are you sure wanna to decline this borrow request?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        fetch("http://127.0.0.1:8000/api/declineBorrow/" + id, {
          method: "put",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            book_id: book_id,
            borrowed: false,
          }),
        }).then((response) => {
          message.success("Request declined.");
          getBooks();
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  //nav
  const goBack = () => {
    history.push("/admin");
  };

  const logout = () => {
    localStorage.clear();
    history.push("/");
  };

  return (
    <>
      <Divider orientation="center">
        <Button type="link" onClick={logout} danger>
          Log Out!
        </Button>
      </Divider>
      <Button className="btn-add" type="primary" onClick={goBack}>
        Back
      </Button>
      <List
        size="small"
        dataSource={books}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <Button type="link" onClick={() => acceptRequest(item.id)}>
                Accept
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => declineRequest(item.id, item.book_id)}
              >
                Decline
              </Button>,
            ]}
          >
            <List.Item.Meta title={item.book_name} />
          </List.Item>
        )}
      />
    </>
  );
}
