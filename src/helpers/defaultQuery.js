import http from "./http"

const query = {
  fetchCompany: async () => {
     const result = await http.get('/api/companies');
     return result.data
  }
}

export default query