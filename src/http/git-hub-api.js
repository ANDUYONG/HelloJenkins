import http from './axios'

const ROOT_PATH = '/github/'

const GitHubAPI = {
    getTreeList: () => http.get(getApiPath('files')),
    getContent: ({ filePath, branch }) => http.get(getApiPath('file'), { params: { filePath, branch } }),
    commitContent: (data) => http.post(getApiPath('commitAndPush'), data),
}

function getApiPath(path) {
    return ROOT_PATH + path
}

export default GitHubAPI