import {
  Button,
  Form,
  Input,
  Modal,
  Spin,
  Row,
  Col,
  Select,
  Checkbox,
  Progress,
  Space,
} from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileServices from "../services/ProfileServices";
import AdminServices from "../services/AdminServices/AdminServices";
import TesterService from "../services/TesterServices/TesterService";
import { CircularChart, TestChart2 } from "./ChartsComponent";
// import { useEffect } from "react";

export const EmailModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await ProfileServices.updateMail(values);
      onCancel();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title={
        <div style={{ textAlign: "center", fontSize: "24px" }}>
          Mise à jour de l'email
        </div>
      }
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Saisir un nouvel email"
          name="newMail"
          rules={[
            { required: true, message: "Le nouvel email est obligatoire" },
            { type: "email", message: "Veuillez saisir un email valide !" },
          ]}
        >
          <Input placeholder="new email" />
        </Form.Item>
        <Form.Item
          label="Retaper un nouvel email"
          name="newMailRetype"
          rules={[
            { required: true, message: "Veuillez retaper le nouvel email" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newMail") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Les deux emails que vous avez saisis ne correspondent pas !"
                  )
                );
              },
            }),
          ]}
        >
          <Input placeholder="retype new email" />
        </Form.Item>
        <Form.Item
          label="Mot de passe"
          name="password"
          rules={[{ required: true, message: "Mot de passe est obligatoire" }]}
        >
          <Input.Password placeholder="Mot de passe" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="Envoyer">{loading ? <Spin /> : "MAJ email"}</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const InfoModal = ({ visible, onCancel, info }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await ProfileServices.updateInfo(values);
      console.log(response.message);
      onCancel();
      toast.success(response.message);
    } catch (error) {
      console.error(error.response.message);
      toast.error(error.response.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title={
        <div style={{ textAlign: "center", fontSize: "24px" }}>
          Mise à jour du profil
        </div>
      }
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ lastname: info.lastname, firstname: info.firstname }}
      >
        <Form.Item label={`Anciennes informations`}>
          <Input
            disabled
            placeholder={`${info.lastname + " " + info.firstname}`}
          />
        </Form.Item>

        <Form.Item
          label={`Saisir un nouveau nom`}
          rules={[{ required: true, message: "Le nom est obligatoire" }]}
          tooltip="Ce champ est obligatoire"
          name="lastname"
        >
          <Input placeholder="Nom" />
        </Form.Item>
        <Form.Item
          label="Tapez un nouveau prénom"
          rules={[{ required: true, message: "Le prénom est obligatoire" }]}
          tooltip="Ce champ est obligatoire"
          name="firstname"
        >
          <Input placeholder="Prénom" />
        </Form.Item>

        <Form.Item>
          <Button htmlType="Envoyer">
            {loading ? <Spin /> : "MAJ Profil"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const PasswordModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await ProfileServices.updatePassword(values);
      onCancel();
      toast.success(response.message);
    } catch (error) {
      console.error(error.response.data);
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title={
        <div style={{ textAlign: "center", fontSize: "24px" }}>
          Mise à jour du mot de passe
        </div>
      }
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          oldPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
        }}
      >
        <Form.Item
          label={"Ancien mot de passe"}
          rules={[
            { required: true, message: "Un nouvel email est obligatoire" },
          ]}
          tooltip="Ce champ est obligatoire"
          name="oldPassword"
        >
          <Input.Password placeholder="Type old password" />
        </Form.Item>

        <Form.Item
          label={`Type new password`}
          rules={[
            {
              required: true,
              message: "Veuillez saisir votre nouveau mot de passe",
            },
          ]}
          tooltip="Ce champ est obligatoire"
          name="newPassword"
        >
          <Input.Password placeholder="Type new password" type="password" />
        </Form.Item>
        <Form.Item
          label={"Retype new password"}
          rules={[
            {
              required: true,
              message: "Veuillez retaper votre nouveau mot de passe",
            },
          ]}
          tooltip="Ce champ est obligatoire"
          name="newPasswordConfirm"
        >
          <Input.Password placeholder="Retype new password" type="password" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">
            {loading ? <Spin /> : "MAJ du mot de passe"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const AddUserModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await AdminServices.addUser(values);
      onCancel();
      console.log(response);
      if (response.error) {
        toast.error(response.error);
      } else if (response.message) {
        toast.success(response.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title={
        <div style={{ textAlign: "center", fontSize: "24px" }}>Add user</div>
      }
      footer={null}
    >
      <Form
        style={{ marginTop: 25 }}
        layout="vertical"
        form={form}
        autoComplete="off"
        onFinish={onFinish}
        initialValues={{
          firstname: "",
          lastname: "",
          email: "",
          password: "",
          passwordVerify: "",
          role: "",
        }}
      >
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              label="Saisir le prénom"
              name="firstname"
              rules={[
                { required: true, message: "Le prénom est obligatoire" },
                { type: "text", message: "Veuillez saisir un nom" },
              ]}
            >
              <Input placeholder="Jon" />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label="Saisir le nom"
              name="lastname"
              rules={[
                { required: true, message: "Le nom est obligatoire" },
                { type: "text", message: "Veuillez entrer le nom !" },
              ]}
            >
              <Input placeholder="Doe" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Saisir l'email"
          name="email"
          rules={[
            { required: true, message: "Email est obligatoire" },
            { type: "email", message: "Veuillez entrer un email valide" },
          ]}
        >
          <Input placeholder="jon.doe@jon.doe" />
        </Form.Item>
        <Form.Item
          label="Saisir le mot de passe"
          name="password"
          rules={[{ required: true, message: "Mot de passe est obligtoire" }]}
        >
          <Input.Password placeholder="password" />
        </Form.Item>
        <Form.Item
          label="Retaper le mot de passe"
          name="passwordVerify"
          rules={[
            { required: true, message: "Veuillez retaper le mot de passe" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Les deux mots de passe que vous avez introduits ne correspondent pas !"
                  )
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Retaper le mot de passe" />
        </Form.Item>
        <Form.Item
          label="Choisir un rôle pour le nouvel utilisateur"
          name="role"
          rules={[{ required: true, message: "Le rôle est obligatoire" }]}
        >
          <Select
            options={[
              {
                value: "tester",
                label: "Tester",
              },
              {
                value: "simpleUser",
                label: "Simple User",
              },
            ]}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            style={{ backgroundColor: "green", color: "white" }}
          >
            {loading ? <Spin /> : "Add new user"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const AddTestModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [method, setMethod] = useState("");
  const [showSecondModal, setShowSecondModal] = useState(false);

  const handleMethodChange = (value) => {
    setMethod(value);
  };
  const [file, setFile] = useState(null);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await TesterService.executerTest(values, file);
      setShowSecondModal(true);
      console.log(res.detail);
      if (values.data) onCancel();
      toast.success("Test effectué avec succès");
      onCancel();

      // Define a function to update the data every second
      const updateData = async () => {
        const updatedRes = await TesterService.getTestById(res._id);
        if (updatedRes) {
          setData(updatedRes.detail);
        }
      };

      // Call the updateData function every second
      const intervalId = setInterval(updateData, 1000);

      // Stop updating the data after 15 seconds
      setTimeout(() => {
        clearInterval(intervalId);
      }, 15000);
    } catch (error) {
      toast.error("Test echoué");
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  return (
    <>
      <Modal
        width={1000}
        open={visible}
        onCancel={onCancel}
        title={
          <div style={{ textAlign: "center", fontSize: "24px" }}>
            Nouveau test
          </div>
        }
        footer={null}
      >
        <Form
          layout="vertical"
          enctype="multipart/form-data"
          form={form}
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 1200,
            marginTop: 50,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
          onValuesChange={(changedValues) => {
            if (changedValues.disablePort) {
              form.setFieldsValue({ port: 0 });
            }
          }}
        >
          <Row>
            <Col span={10} offset={2}>
              <Form.Item
                label="Nom du test"
                name="testName"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le nom du test !",
                  },
                ]}
              >
                <Input placeholder="Java test" type="text" name="testName" />
              </Form.Item>
              <Form.Item
                label="Protocole"
                name="protocol"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le protocol du test !",
                  },
                ]}
              >
                <Select
                  defaultValue={""}
                  placeholder="http / https / .."
                  style={{ width: "100%" }}
                  name="protocol"
                  options={[
                    { value: "http", label: "HTTP" },
                    { value: "https", label: "HTTPS" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="URL"
                name="url"
                rules={[{ required: true, message: "Veuillez saisir l'URL !" }]}
              >
                <Input placeholder="google.com" type="text" name="url" />
              </Form.Item>
              <Form.Item label="Port" name="port">
                <Row>
                  <Col span={8}>
                    <Form.Item
                      name="disablePort"
                      valuePropName="checked"
                      noStyle
                    >
                      <Checkbox>No Port</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={16}>
                    <Input
                      placeholder="8888"
                      defaultValue={"0"}
                      type="text"
                      name="port"
                      disabled={form.getFieldValue("disablePort")}
                    />
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                label="Upload bytecode"
                name="file"
                rules={[
                  { required: true, message: "Veuillez ajouter un fichier !" },
                ]}
              >
                <input
                  name="file"
                  type="file"
                  accept=".class"
                  onChange={(e) => {
                    console.log(e);
                    setFile(e.target.files[0]);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={11} offset={1}>
              <Form.Item
                label="Chemin"
                name="path"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le chemin !",
                  },
                ]}
              >
                <Input type="text" name="filename" placeholder="/about" />
              </Form.Item>
              <Form.Item
                label="Nombre&nbsp;d'utilisateurs"
                name="usersNumber"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le nombre d'utilisateurs !",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (value > 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Ce champs doit etre supérieur à zero")
                      );
                    },
                  }),
                ]}
              >
                <Input name="usersNumber" />
              </Form.Item>
              <Form.Item
                label="Méthode"
                name="method"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir la méthode !",
                  },
                ]}
              >
                <Select
                  defaultValue={""}
                  placeholder="POST GET ..."
                  style={{ width: "100%" }}
                  name="method"
                  onChange={handleMethodChange}
                  options={[
                    { value: "get", label: "GET" },
                    { value: "post", label: "POST" },
                  ]}
                />
              </Form.Item>
              {method === "post" && (
                <Form.Item
                  label="Le corps de la requête"
                  name="data"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez saisir le corps en format JSON !",
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Request body in JSON format"
                    name="data"
                    autoSize={{ minRows: 3, maxRows: 12 }}
                  />
                </Form.Item>
              )}
              <Form.Item>
                <Button
                  htmlType="submit"
                  style={{ backgroundColor: "green", color: "white" }}
                >
                  {loading ? <Spin /> : "Executer le test"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      {showSecondModal && (
        <Modal
          open={showSecondModal}
          onCancel={() => setShowSecondModal(false)}
          footer={null}
          width={1000}
        >
          <TestChart2 values={data} />
          <Button
            htmlType="submit"
            style={{ backgroundColor: "#2596be", color: "white" }}
            onClick={onCancel}
          >
            Fermer
          </Button>
        </Modal>
      )}
    </>
  );
};

export const TestStatusModel = ({ visible, onCancel, id, name }) => {
  return (
    <Modal open={visible} onCancel={onCancel} footer={null} width={1000}>
      <CircularChart isAdmin={true} id={id} name={name} />
      <Button
        htmlType="submit"
        style={{ backgroundColor: "#2596be", color: "white" }}
        onClick={onCancel}
      >
        Fermer
      </Button>
    </Modal>
  );
};

export const TestPercentageModal = ({ visible, onCancel, percentage }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title="Pourcentage du test"
      width={450}
      footer={null}
    >
      <Row
        justify="center"
        align="middle"
        style={{ marginTop: "25px", marginBottom: "25" }}
      >
        <Col>
          <Row justify="center">
            <Space wrap>
              <Progress
                type="circle"
                percent={percentage.failed}
                status="exception"
                format={() => `${percentage.failed}%`}
              />
              <Progress
                type="circle"
                percent={percentage.passed}
                format={() => `${percentage.passed}%`}
                status="success"
              />
            </Space>
          </Row>
          <Row justify="center" style={{ marginTop: "24px" }}>
            <Button
              type="primary"
              onClick={onCancel}
              style={{ backgroundColor: "#2596be", color: "white" }}
            >
              Fermer
            </Button>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};
