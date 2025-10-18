import http from './axios'

const ROOT_PATH = '/api/jenkins/'

const JenkinsAPI = {
    getOverview: (branchName, buildNumber, node) => http.get(getApiPath(`overview/${branchName}/${buildNumber}/${node}`)),
}

function getApiPath(path) {
    return ROOT_PATH + path
}

export default JenkinsAPI