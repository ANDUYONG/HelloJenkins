import http from './axios'

const ROOT_PATH = '/github/'

const GitHubAPI = {
    getTreeList: () => http.get(getApiPath('files')),
    getContent: ({ filePath, branch }) => http.get(getApiPath('file'), { params: { filePath, branch } }),
}

function getApiPath(path) {
    return ROOT_PATH + path
}

export default GitHubAPI