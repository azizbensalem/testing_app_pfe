import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";
const token = localStorage.getItem("token");

const addUser = async (data) => {
  try {
    const result = await axios.post(
      `${API_URL}/register`,
      {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        passwordVerify: data.passwordVerify,
        role: data.role,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

const getAllUsers = async () => {
  const result = await axios.get(`${API_URL}/all-users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return result.data;
};

const deleteUserById = async (id) => {
  const result = await axios.delete(`${API_URL}/delete-user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return result.data;
};

const getTestsStatusPerUserId = async (id) => {
  const result = await axios.get(`${API_URL}/get-status/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return result.data;
}
const updateDataset = async () => {
  const result = await axios.get(`${API_URL}/update-dataset`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return result.data;
};

const AdminServices = {
  getAllUsers,
  addUser,
  deleteUserById,
  getTestsStatusPerUserId,
  updateDataset,
};

export default AdminServices;
