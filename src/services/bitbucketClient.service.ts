import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';

const API_URL = 'https://api.bitbucket.org/2.0/';

export default class BitbucketService {
  private http: AxiosInstance;
  public token: string;

  constructor(token: string) {
    if (!token || token.length === 0) {
      throw new Error('Incorrect BitbucketAPI token provided');
    }

    this.token = token;
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

  async getRepositoryInfo(repositoryName: string): Promise<Repository> {
    const request = await axios.get(
      'https://api.bitbucket.org/2.0/repositories/' + repositoryName,
    );

    return request.data;
  }

  async getFile(
    repositoryName: string,
    mainBranch: string,
    fileName: string,
  ): Promise<string> {
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
  ): Promise<void> {
    const data = new FormData();
    data.append(fileName, fileContent);
    data.append('message', commitMessage);
    data.append('branch', newBranch);

    await this.http.post(
      `https://api.bitbucket.org/2.0/repositories/${workspaceUUID}/${repositoryUUID}/src`,
      data,
      {
        headers: {
          ...data.getHeaders(),
        },
      },
    );
  }

  async createPullrequest(
    title: string,
    sourceBranch: string,
    workspaceUUID: string,
    repositoryUUID: string,
  ): Promise<CreatePullRequestResponse> {
    const data = {
      title: title,
      source: {
        branch: {
          name: sourceBranch,
        },
      },
    };

    const request = await this.http.post<CreatePullRequestResponse>(
      `https://api.bitbucket.org/2.0/repositories/${workspaceUUID}/${repositoryUUID}/pullrequests`,
      data,
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    );

    return request.data;
  }
}
