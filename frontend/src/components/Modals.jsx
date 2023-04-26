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
  Table,
  Steps,
} from "antd";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileServices from "../services/ProfileServices";
import AdminServices from "../services/AdminServices/AdminServices";
import TesterService from "../services/TesterServices/TesterService";
import { CircularChart } from "./ChartsComponent";
import AuthVerifyService from "../services/AuthServices/AuthVerifyService";
import {
  // FileAddOutlined,
  // DeleteTwoTone,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
const { Step } = Steps;

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
          <Input placeholder="nouveau.mail@nouv.mail" />
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
          <Input placeholder="re.nouv-mail@re-no.mail" />
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

  // Custom validation rule to check if new password and confirmation password match
  const checkPasswordsMatch = (rule, value) => {
    if (value && value !== form.getFieldValue("newPassword")) {
      Promise.resolve("Les deux mots de passe doivent être identiques.");
    } else {
      Promise.resolve();
    }
  };

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
          <Input.Password placeholder="ancienne mot de passe" />
        </Form.Item>

        <Form.Item
          label={`Tapez le nouveau mot de passe`}
          rules={[
            {
              required: true,
              message: "Veuillez saisir votre nouveau mot de passe",
            },
            {
              min: 8,
              message: "Le mot de passe doit avoir au moins 8 caractères",
            },
            { validator: checkPasswordsMatch },
          ]}
          tooltip="Ce champ est obligatoire"
          name="newPassword"
        >
          <Input.Password placeholder="nouveau mot de passe" type="password" />
        </Form.Item>
        <Form.Item
          label={"Retapez le nouveau mot de passe"}
          rules={[
            {
              required: true,
              message: "Veuillez retaper votre nouveau mot de passe",
            },
            { validator: checkPasswordsMatch },
          ]}
          tooltip="Ce champ est obligatoire"
          name="newPasswordConfirm"
        >
          <Input.Password placeholder="nouveau mot de passe" type="password" />
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
        <div style={{ textAlign: "center", fontSize: "24px" }}>
          Ajouter un utilisateur
        </div>
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
            {loading ? <Spin /> : "Ajouter"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const AddTestModal = ({ visible, onCancel, step, next, back }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Authentifiez-vous sur GitHub ou GitLab",
      description:
        "Assurez-vous d'être authentifié sur votre compte GitHub ou GitLab.",
    },
    {
      title: "Vérifiez votre accès au repository",
      description:
        "Assurez-vous d'être un collaborateur du repository de l'application que vous allez tester. Si ce n'est pas le cas, demandez à être ajouté en tant que collaborateur.",
    },
    {
      title: "Remplissez le formulaire de test",
      description:
        "Après avoir vérifié ces éléments, vous pouvez remplir le formulaire pour tester votre application.",
    },
  ];

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleMethodChange = (value) => {
    setMethod(value);
  };
  //const [files, setFiles] = useState([]);
  //const hasFiles = files.length > 0;

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Steps current={currentStep}>
              {steps.map((step) => (
                <Step
                  key={step.title}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </Steps>
            <div style={{ marginTop: 20 }}>
              {currentStep > 0 && (
                <Button
                  style={{ marginRight: 8, backgroundColor: "yellowgreen" }}
                  onClick={handlePrev}
                >
                  <ArrowLeftOutlined /> Précédent
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={handleNext}
                  style={{ backgroundColor: "#00A07C" }}
                >
                  Suivant <ArrowRightOutlined />
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  type="primary"
                  style={{ backgroundColor: "#41B95F" }}
                  onClick={next}
                >
                  Etape suivante <CheckOutlined />
                </Button>
              )}
            </div>
          </>
        );
      case 2:
        return (
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
                  label="Lien du repo github"
                  name="linkRepo"
                  rules={[
                    {
                      required: true,
                      message:
                        "Veuillez saisir le lien du projet dans github !",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    name="linkRepo"
                    placeholder="github.com/abc.def"
                  />
                </Form.Item>
                <Form.Item
                  label="Chemin du projet"
                  name="file"
                  rules={[
                    {
                      required: true,
                      message:
                        "Veuillez saisir le lien du projet dans votre ordinateur !",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    name="file"
                    placeholder="c://bureau/java-proj"
                  />
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
                  rules={[
                    { required: true, message: "Veuillez saisir l'URL !" },
                  ]}
                >
                  <Input placeholder="google.com" type="text" name="url" />
                </Form.Item>

                {/* <Form.Item
                  label="Upload bytecode"
                  name="files"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez ajouter un fichier !",
                    },
                  ]}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label
                      htmlFor="file-upload"
                      style={{ fontSize: "16px", marginBottom: "10px" }}
                    >
                      Sélectionnez un ou plusieurs fichiers :
                    </label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        id="file-upload"
                        name="files"
                        type="file"
                        accept=".class"
                        multiple
                        onChange={(e) => {
                          setFiles([...files, ...e.target.files]);
                        }}
                        style={{ display: "none" }}
                      />
                      <label
                        htmlFor="file-upload"
                        style={{
                          fontSize: "14px",
                          padding: "10px",
                          backgroundColor: "#f5f5f5",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        {hasFiles ? (
                          <FileAddOutlined />
                        ) : (
                          <span>Parcourir</span>
                        )}
                      </label>
                      <div
                        style={{
                          marginLeft: "10px",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {files.map((file, index) => (
                          <div
                            key={file.name}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "5px",
                              padding: "5px",
                              border: "1px solid #ccc",
                              borderRadius: "5px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                marginRight: "5px",
                                flexGrow: 1,
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {file.name}
                            </span>
                            <div
                              style={{
                                borderLeft: "1px solid #ccc",
                                paddingLeft: "5px",
                              }}
                            >
                              <Button
                                type="button"
                                onClick={() => {
                                  const newFiles = [...files];
                                  newFiles.splice(index, 1);
                                  setFiles(newFiles);
                                }}
                              >
                                <DeleteTwoTone
                                  twoToneColor="#ff4d4f"
                                  style={{ fontSize: "20px" }}
                                />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Form.Item> */}
              </Col>
              <Col span={11} offset={1}>
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
                  label="Chemin"
                  name="path"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez saisir le chemin !",
                    },
                  ]}
                >
                  <Input type="text" name="path" placeholder="/about" />
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
                  <Space>
                    <Button
                      onClick={() => {
                        back();
                        setCurrentStep(0);
                      }}
                      style={{ backgroundColor: "yellowgreen", color: "white" }}
                    >
                      <ArrowLeftOutlined /> Retour
                    </Button>
                    <Button
                      htmlType="submit"
                      style={{ backgroundColor: "green", color: "white" }}
                    >
                      {loading ? <Spin /> : "Executer le test"}
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        );
      default:
        return null;
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const role = AuthVerifyService.userRole();
    console.log(values);
    //await TesterService.executerTest(values, false, files)
    await TesterService.executerTest(values, false)
      .then((res) => {
        if (values.data) onCancel();
        toast.success("Test effectué avec succès");
        onCancel();
        window.location.href = `/${role}/test/${res._id}`;
      })
      .catch(() => {
        toast.danger("Test echoué");
      });
    setLoading(false);
    onCancel();
  };

  return step === 1 ? (
    <Modal
      closable={true}
      maskClosable={true}
      width={1000}
      open={visible}
      onCancel={() => {
        onCancel();
        setCurrentStep(0)
      }}
      style={{
        left: step === 1 ? 0 : "-100%",
        transition: "left 0.5s ease-in-out",
      }}
      title={
        <div style={{ textAlign: "center", fontSize: "24px" }}>
          Les étapes à suivre
        </div>
      }
      footer={null}
    >
      {renderContent()}
    </Modal>
  ) : (
    <Modal
      closable={false}
      maskClosable={false}
      width={1000}
      open={visible}
      onCancel={onCancel}
      style={{
        left: step === 2 ? 0 : "100%",
        transition: "left 0.5s ease-in-out",
      }}
      title={
        <div style={{ textAlign: "center", fontSize: "24px" }}>
          Formulaire pour un nouveau test
        </div>
      }
      footer={null}
    >
      {renderContent()}
    </Modal>
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

export const TestDetailModal = ({ visible, onCancel, detailArray }) => {
  const columns = [
    {
      title: "Champ",
      dataIndex: "detail",
      key: "detail",
      render: (text) => <span style={{ color: "#0077c2" }}>{text}</span>,
    },
    {
      title: "Valeur",
      dataIndex: "value",
      key: "value",
      render: (text) => <span style={{ color: "#2d9a1a" }}>{text}</span>,
    },
  ];
  const data = [
    {
      key: "1",
      detail: "Nom du test",
      value: detailArray.testName,
    },
    {
      key: "2",
      detail: "Protocole du test",
      value: detailArray.protocol,
    },
    {
      key: "3",
      detail: "L'url du test",
      value: detailArray.url,
    },
    {
      key: "4",
      detail: "Port du test",
      value: detailArray.port,
    },
    {
      key: "5",
      detail: "Chemin du test",
      value: detailArray.path,
    },
    {
      key: "6",
      detail: "Méthode du test",
      value: detailArray.method,
    },
    {
      key: "7",
      detail: "Nombre d'utilisateurs",
      value: detailArray.usersNumber,
    },
  ];
  return (
    <Modal
      title={
        <div
          style={{
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "20px",
            color: "#1784C6",
          }}
        >
          Détails du test
        </div>
      }
      onCancel={onCancel}
      open={visible}
      width={400}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="small"
      />
    </Modal>
  );
};
