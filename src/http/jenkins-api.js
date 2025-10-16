import http from './axios'

const ROOT_PATH = '/api/jenkins/'

const GitHubAPI = {
    getOverview: (buildNumber) => http.get(getApiPath(`pipeline-overview/${buildNumber}`)),
}

function getApiPath(path) {
    return ROOT_PATH + path
}

export default GitHubAPI