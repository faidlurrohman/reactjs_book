import React, { useEffect, useState } from "react";
import { List, Divider, Button, Modal, Form, Input, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import "../App.css";

const { confirm } = Modal;

export default function Admin() {
  const history = useHistory();
  const [defaultId, setId] = useState(null);
  const [defaultName, setName] = useState(null);
  const [defaultQty, setQty] = useState(Number);
  const [newName, setNewName] = useState(null);
  const [newQty, setNewQty] = useState(Number);
  const [addModal, setAdd] = useState(false);
  const [addSpin, setSpinAdd] = useState(false);
  const [editModal, setEdit] = useState(false);
  const [editSpin, setSpin] = useState(false);
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

  //add
  const showAdd = () => {
    setAdd(true);
  };

  const addName = (e) => {
    setNewName(e.target.value);
  };

  const addQty = (e) => {
    setNewQty(e.target.value);
  };

  const handleAdd = () => {
    setSpinAdd(true);
    fetch("http://127.0.0.1:8000/api/books", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        qty: newQty,
      }),
    }).then((response) => {
      setTimeout(() => {
        setAdd(false);
        setSpinAdd(false);
        getBooks();
        message.success("Book added.");
      }, 2000);
      return response.json();
    });
  };

  const handleCancelAdd = () => {
    setAdd(false);
  };

  //edit
  const showEdit = (id) => {
    fetch("http://127.0.0.1:8000/api/books/" + id)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setId(id);
        setName(data.name);
        setQty(data.qty);
      });
    setEdit(true);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleQty = (e) => {
    setQty(e.target.value);
  };

  const handleEdit = () => {
    setSpin(true);
    fetch("http://127.0.0.1:8000/api/books/" + defaultId, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: defaultName,
        qty: defaultQty,
      }),
    }).then((response) => {
      setTimeout(() => {
        setEdit(false);
        setSpin(false);
        getBooks();
        message.success("Book edited.");
      }, 2000);
      return response.json();
    });
  };

  const handleCancelEdit = () => {
    setEdit(false);
  };

  //delete
  const deleteBook = (id) => {
    confirm({
      title: "Are you sure delete this book?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        fetch("http://127.0.0.1:8000/api/books/" + id, {
          method: "delete",
        }).then((response) => {
          message.success("Book deleted.");
          getBooks();
          // console.log(response);
          // console.log("success delete");
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  //nav
  const borrowBook = () => {
    history.push("/borrow");
  };

  const returnBook = () => {
    history.push("/return");
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
      <Button className="btn-add" type="primary" onClick={showAdd}>
        Add Book
      </Button>
      <Button className="btn-add" type="primary" onClick={borrowBook}>
        Borrow Request
      </Button>
      <Button className="btn-add" type="primary" onClick={returnBook}>
        Return Request
      </Button>
      <List
        size="small"
        dataSource={books}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            actions={[
              <Button type="link" onClick={() => showEdit(item.id)}>
                Edit
              </Button>,
              <Button type="link" danger onClick={() => deleteBook(item.id)}>
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={`Book Name : ${item.name}`}
              description={`Qty : ${item.qty}`}
            />
          </List.Item>
        )}
      />
      <Modal
        title="Edit Book"
        visible={editModal}
        onOk={handleEdit}
        confirmLoading={editSpin}
        onCancel={() => handleCancelEdit()}
      >
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
          <Form.Item label="Name">
            <Input
              name="name"
              value={defaultName}
              onChangeCapture={(e) => handleName(e)}
            />
          </Form.Item>
          <Form.Item label="Qty">
            <Input
              type="number"
              name="qty"
              value={defaultQty}
              onChangeCapture={(e) => handleQty(e)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Add Book"
        visible={addModal}
        onOk={handleAdd}
        confirmLoading={addSpin}
        onCancel={() => handleCancelAdd()}
      >
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 14 }}>
          <Form.Item label="Name">
            <Input name="newName" onChangeCapture={(e) => addName(e)} />
          </Form.Item>
          <Form.Item label="Qty">
            <Input
              type="number"
              name="newQty"
              onChangeCapture={(e) => addQty(e)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
