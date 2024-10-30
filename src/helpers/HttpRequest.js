import axios from "axios";
const apiHost = "http://localhost:1337/api"
const httpRequest = {
  get: async (url, data) => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${apiHost}${url}`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : {"data": data}
      };
      
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.log(error)
    } 
  },
  put: async (url, data) => {
    try {
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${apiHost}${url}`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : {"data": data}
      };
      
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.log(error)
    } 
  },
  post: async (url, data) => {
    try {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${apiHost}${url}`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : {"data": data}
      };
      
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.log(error)
    } 
  }
}

export default httpRequest