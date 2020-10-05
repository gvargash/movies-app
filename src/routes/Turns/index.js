import React, { useState, useEffect } from "react";
import { Card, Button, Table, Tag, Tooltip, Spin, Form, DatePicker, Checkbox, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { cardProps, tableProps, dateFormatList } from "../../util/config";
import moment from "moment";
import Modal from "antd/lib/modal/Modal";
import app from "./../../util/firebaseApp";
const Turns = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [rowUpdate, setRowUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleCancel = () => {
    setVisible(false);
    setRowUpdate(null);
  };
  const showModal = () => {
    setVisible(true);
  };
  const handleOnEdit = (record) => {
    setVisible(true);
    setRowUpdate(record);
    form &&
      form.setFieldsValue({
        dTurn: record.dTurn && moment(record.dTurn),
        bState: record.bState,
      });
  };

  const handleOnDelite = (record) => {
    const db = app.firestore();
    db.collection("turns")
      .doc(record.uid)
      .delete()
      .then(() => {
        message.success("Turno eliminada con exito.");
        getTurns();
      })
      .catch((error) => {
        message.error("Error:", error);
      });
  };

  const onFinish = (values) => {
    const db = app.firestore();
    setLoading(true);
    if (rowUpdate) {
      db.collection("turns")
        .doc(rowUpdate.uid)
        .update({
          dTurn: values.dTurn.format(dateFormatList[3]),
          bState: values.bState,
        })
        .then(() => {
          onSuccess("Datos turno actualizado con exito.");
        })
        .catch((error) => {
          onError(error);
        });
    } else {
      db.collection("turns")
        .add({
          dTurn: values.dTurn.format(dateFormatList[3]),
          bState: values.bState,
        })
        .then(() => {
          onSuccess();
        })
        .catch((error) => {
          onError(error);
        });
    }
  };
  const getTurns = async () => {
    try {
      setLoading(true);
      const db = app.firestore();
      const moviesRef = await db.collection("turns").get();
      const data = moviesRef.docs.map((doc) => {
        const info = doc.data();
        const uid = doc.id;
        return { ...info, uid };
      });
      setDataSource(data);
      setLoading(false);
    } catch (error) {
      message.error("Error:", error);
      setLoading(false);
    }
  };

  const onSuccess = (text = "Turno registrado con exito.") => {
    handleCancel();
    setLoading(false);
    getTurns();
    form.resetFields();
    message.success(text);
  };

  const onError = (error) => {
    message.error("Error:", error);
    setLoading(false);
  };

  useEffect(() => {
    getTurns();
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "nId",
      key: "nId",
      width: 50,
      align: "center",
      render: (value, record, index) => index + 1,
    },
    {
      title: "Turno",
      dataIndex: "dTurn",
      key: "dTurn",
      render: (value) => value && moment(value).format("HH:mm"),
    },
    {
      title: "Estado",
      dataIndex: "bState",
      key: "bState",
      render: (value) => (value ? <Tag color="green">Activo</Tag> : <Tag color="red">Inactivo</Tag>),
    },
    {
      title: "",
      dataIndex: "sActions",
      key: "sActions",
      width: 100,
      render: (value, record) => (
        <div className="gx-d-flex gx-space-between">
          <Tooltip title="Editar">
            <Button icon={<EditOutlined />} size="small" type="primary" ghost onClick={() => handleOnEdit(record)} />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button icon={<DeleteOutlined />} size="small" type="danger" danger onClick={() => handleOnDelite(record)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Card
      title="PELICULAS"
      {...cardProps}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Nuevo
        </Button>
      }
    >
      <Modal title={rowUpdate ? "EDITAR TURNO" : "NUEVA TURNO"} visible={visible} onCancel={handleCancel} footer={null}>
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" name="turnForm" onFinish={onFinish}>
            <Form.Item label="Turno" name="dTurn" rules={[{ required: true, message: "Seleccione ingrese Turno." }]}>
              <DatePicker.TimePicker format={"HH:mm"} className="gx-w-100" />
            </Form.Item>

            <Form.Item label="Estado" name="bState" valuePropName="checked" rules={[{ required: true, message: "Seleccione Estado." }]}>
              <Checkbox>Activo?</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Grabar
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <Table columns={columns} dataSource={dataSource} loading={loading} {...tableProps} rowKey={(record) => record.uid} />
    </Card>
  );
};

export default Turns;
