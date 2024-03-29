import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';

const API_URL = 'https://api.bitbucket.org/2.0/';

class BitbucketAPI {
  private http: AxiosInstance;
  public token: string;

  constructor() {
    this.http = axios.create({
      baseURL: API_URL,
    });

    this.http.interceptors.request.use(async (httpConfig) => {
      if (!this.token) {
        throw new Error('No token available.');
      }

      if (!httpConfig.headers.Authorization) {
        httpConfig.headers.Authorization = `Bearer ${this.token}`;
      }

      return httpConfig;
    });
  }

  async getRepositoryInfo(repositoryName: string) {
    const request = await axios.get(
      'https://api.bitbucket.org/2.0/repositories/' + repositoryName,
    );

    return request.data;
  }

  async getFile(repositoryName: string, mainBranch: string, fileName: string) {
    const request = await axios.get(
      `https://api.bitbucket.org/2.0/repositories/${repositoryName}/src/${mainBranch}/${fileName}`,
      { transformResponse: (r) => r },
    );

    return request.data;
  }

  async commitFile(
    fileName: string,
    fileContent: string,
    workspaceUUID: string,
    repositoryUUID: string,
    commitMessage: string,
    newBranch: string,
  ) {
    const data = new FormData();
    data.append(fileName, fileContent);
    data.append('message', commitMessage);
    data.append('branch', newBranch);

    const request = await this.http.post(
      `https://api.bitbucket.org/2.0/repositories/${workspaceUUID}/${repositoryUUID}/src`,
      data,
      {
        headers: {
          ...data.getHeaders(),
        },
      },
    );

    return request;
    /*
    curl --request POST \
  --url 'https://api.bitbucket.org/2.0/repositories/{workspace}/{repo_slug}/src?message=Test&files' \
  --header 'Authorization: Bearer <access_token>'
   */
  }

  async createPullrequest(
    title: string,
    sourceBranch: string,
    workspaceUUID: string,
    repositoryUUID: string,
  ) {
    const data = {
      title: title,
      source: {
        branch: {
          name: sourceBranch,
        },
      },
    };

    const request = await this.http.post(
      `https://api.bitbucket.org/2.0/repositories/${workspaceUUID}/${repositoryUUID}/pullrequests`,
      data,
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );

    return request;
  }
}

export default new BitbucketAPI();
