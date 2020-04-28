import React, { useEffect, useState } from "react";
import { List, Divider, Button, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import "../App.css";

const { confirm } = Modal;

export default function Dashboard() {
  const history = useHistory();
  const [books, setBooks] = useState([]);

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
    getBooks();
  }, []);

  const getBooks = () => {
    fetch("http://127.0.0.1:8000/api/books")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setBooks(data.reverse());
      });
  };

  //borrow
  const borrowBook = (id, bookName) => {
    confirm({
      title: "Are you sure want to borrow this book?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "success",
      cancelText: "No",
      onOk() {
        fetch("http://127.0.0.1:8000/api/requestBorrow", {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: parseInt(localStorage.getItem("user")),
            book_id: id,
            book_name: bookName,
            borrowed: true,
            returned: false,
            confirmed: false,
          }),
        }).then((response) => {
          getBooks();
          message.success("Request borrow a book success.");
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  //nav
  const borrowedBook = () => {
    history.push("/borrowed");
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
      <Button className="btn-add" type="primary" onClick={borrowedBook}>
        Borrowed
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
                onClick={() => borrowBook(item.id, item.name)}
                disabled={item.qty === 0 && true}
              >
                {item.qty === 0 ? "Out of Stock" : "Borrow"}
              </Button>,
            ]}
          >
            <List.Item.Meta title={item.name} />
          </List.Item>
        )}
      />
    </>
  );
}
