import React, { useEffect, useState } from "react";
import { List, Divider, Button, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import "../App.css";

const { confirm } = Modal;

export default function BorrowedUser() {
  const history = useHistory();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    let userData = localStorage.getItem("user");
    if (userData === null) {
      history.push("/");
    }
    getBooks();
  }, []);

  const getBooks = () => {
    fetch("http://127.0.0.1:8000/api/borrowed", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: parseInt(localStorage.getItem("user")),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBooks(data.reverse());
      });
  };

  //return
  const returnBook = (id, book_id) => {
    confirm({
      title: "Are you sure wanna to return this book?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        fetch("http://127.0.0.1:8000/api/returnBook/" + id, {
          method: "put",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            book_id: book_id,
            borrowed: false,
            returned: true,
            confirmed: false,
          }),
        }).then((response) => {
          message.success("Request return a book success.");
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
    history.push("/dashboard");
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
              <Button
                type="link"
                onClick={() => returnBook(item.id, item.book_id)}
              >
                Return
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
