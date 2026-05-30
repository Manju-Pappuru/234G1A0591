import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.ACCESS_TOKEN;

const Log = async (stack, level, packageName, message) => {
  try {
    console.log("Token Loaded:", TOKEN ? "YES" : "NO");

    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Log Success");
    return response.data;
  } catch (err) {
    console.log("Status:", err.response?.status);
    console.log("Response:", err.response?.data);
  }
};

export default Log;