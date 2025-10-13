import http from './axios'

const ROOT_PATH = '/github/'

const GitHubAPI = {
    getTreeList: (branch) => http.get(getApiPath('files'), { params: { branch } }),
    getContent: ({ filePath, branch }) => {
        // 안전하게 undefined 체크 + 로그
        console.log('Axios getContent params:', { filePath, branch })

        return http.get(getApiPath('file'), { 
            params: { 
                filePath, 
                branch: branch ?? 'main' // undefined면 기본값 사용
            } 
        })
    },
    commitContent: ({ list, branch }) => http.post(getApiPath('commitAndPush'), { list, branch }),
    branches: () => http.get(getApiPath('branches')),
    createBranch: (branch) => http.post(getApiPath('createBranch'), branch),
}

function getApiPath(path) {
    return ROOT_PATH + path
}

export default GitHubAPI