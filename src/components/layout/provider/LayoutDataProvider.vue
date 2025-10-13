<script setup lang="ts">
    import GitHubAPI from '@/http/git-hub-api';
    import { onBeforeMount, provide, reactive, toRaw } from 'vue'
    import LeftArea from '../LeftArea.vue';

    export interface LayoutDataProviderProps {
        leftArea: LeftArea
        mainArea: MainArea
        hiddenArea : HiddenArea
    }

    export interface LeftArea {
        sha: string
        truncated: boolean
        tree: LeftAreaNode[]
        msg: string
        select: Branch[]
        selectedItem: Branch | DefaultSelectItem
        selectedSavedTab?: string
        processList: Process[]
        isShowSelectSpinner: boolean
    }

    export interface LeftAreaNode {
        fileName: string
        filePath: string
        children: LeftAreaNode[] | null
        file: boolean
        path: string
        mode: string
        type: 'blob' | 'tree'
        sha: string
        size: number | null
    }

    export interface MainArea {
        currentNode: Node | null
        savedNodes: Node[] | null
    }

    export interface Node {
        name: string
        path: string
        sha: string
        size: number
        content: string
        encoding: 'base64' | string
        url: string
        htmlUrl: string
        gitUrl: string
        downloadUrl: string
        decodedData: string | null
        encodedData: string | null
        message: string | null
        status: string | null
    }

    export interface HiddenArea {
        isVisible: boolean
    }

    export interface DefaultSelectItem {
        name: string
        val: string
    }

    export interface Branch {
        protected: boolean;
        name: string;
        commit: Commit;
        protection: Protection;
        protection_url: string;
    }

    export interface Commit {
        // author: Author | null;
        // committer: Committer | null;
        message: string | null;
        // tree: Tree | null;
        url: string;
        // comment_count: number;
        // verification: Verification | null;
    }

    // export interface Author {
    //     name: string;
    //     email: string;
    //     date: string;
    // }

    // export interface Committer {
    //     name: string;
    //     email: string;
    //     date: string;
    // }

    // export interface Tree {
    //     sha: string;
    //     url: string;
    // }

    // export interface Verification {
    //     verified: boolean;
    //     reason: string;
    //     signature: string;
    //     payload: string;
    // }

    export interface Protection {
        enabled: boolean;
        required_status_checks: RequiredStatusChecks;
    }

    export interface RequiredStatusChecks {
        enforcement_level: string;
        contexts: string[];
        checks: any[]; // 실제 API에 맞춰 상세 타입 지정 가능
    }

    export interface Process {
        name: string
        nodes: Node[]
    }

    export interface API {
        commitAndDeploy: () => void
        save: () => void
        detail: (path: string) => void
        init: () => void
        getBranches: (branch: string) => void

        clickItemInSaveView: (node: Node) => void
    }

    const initModel: LayoutDataProviderProps = {
        leftArea: {
            sha: '',
            truncated: false,
            tree: [],
            msg: '',
            select: [],
            selectedItem: {
                name: '-- 브랜치를 선택하세요. --',
                val: '',
            },
            processList: [],
            isShowSelectSpinner: false
        },
        mainArea: {
            currentNode: {
                name: '',
                path: '',
                sha: '',
                size: 0,
                content: '',
                encoding: 'base64',
                url: '',
                htmlUrl: '',
                gitUrl: '',
                downloadUrl: '',
                decodedData: '',
                encodedData: null,
                message: null,
                status: null
            },
            savedNodes: [],
        },
        hiddenArea: {
            isVisible: false
        }
    }

    const leftArea = reactive<LeftArea>({...initModel.leftArea})
    const mainArea = reactive<MainArea>({...initModel.mainArea})
    const hiddenArea = reactive<HiddenArea | null>({...initModel.hiddenArea})

    const helper = {
        decodeBase64(base64String) {
            const binary = atob(base64String);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return new TextDecoder('utf-8').decode(bytes);
        },
        utf8ToBase64(str) {
            return btoa(unescape(encodeURIComponent(str)));
        },
    }

    const API = {
        selectChangeEvent() {
            mainArea.currentNode = null
        },
        async commitAndDeploy() {
            if(!leftArea.processList.flatMap(x => x.nodes).length) return alert('변경된 파일이 존재하지 않습니다.')
            else if(!leftArea.msg) return alert('커밋 메세지를 입력하세요.')
            else if(confirm('커밋 및 배포 하시겠습니까?')) {
                await Promise.all(leftArea.processList.map(x => {
                    const list = x.nodes.map(y => {
                        return {
                            ...y,
                            message: leftArea.msg,
                        }
                    })
                    const branch = x.name
                    return GitHubAPI.commitContent({ list, branch })
                })).then(response => {
                    alert('배포가 완료되었습니다. : ' + response);
                    hiddenArea.isVisible = false
                })
                .catch(error => {
                    alert('배포 중 오류가 발생했습니다. 다시 시도해주세요.');
                    hiddenArea.isVisible = false
                });
            }
        },
        save() {
            if(!mainArea.currentNode.path) return alert('수정할 파일을 먼저 선택해주세요.')
            if(confirm('변경 내용을 저장하시겠습니까?')) {
                const selectedTab = leftArea.selectedSavedTab
                const processIdx = leftArea.processList.findIndex(x => x.name === selectedTab)
                const nodes = leftArea.processList[processIdx].nodes
                const curr = mainArea.currentNode
                
                // 1. 기존에 저장된 배열에 존재하는지
                // - 저장된 노드가 있다면 노드의 내용을 바꾼다.
                // 2. 저장된 노드가 없다면 추가.
                const exist = nodes.find(x => x.path === curr.path) 
                if(exist) {
                    const idx = nodes.findIndex(x => x === exist)
                    const target = nodes[idx]
                    target.decodedData = curr.decodedData
                    target.encodedData = helper.utf8ToBase64(curr.decodedData) 
                    target.content = helper.utf8ToBase64(curr.decodedData)
                } else {
                    curr.content = helper.utf8ToBase64(curr.decodedData)
                    curr.encodedData = helper.utf8ToBase64(curr.decodedData) 
                    nodes.push(curr)
                }

                if(selectedTab) leftArea.selectedSavedTab = selectedTab
            }
        },
        detail(path: string) {
            if(leftArea.processList
                .filter(x => x.name !== leftArea.selectedItem.name)
                .flatMap(x => x.nodes)
                .find(x => x.path === path))
            return alert('각각의 브랜치에서 같은 파일을 수정할 수 없습니다.')
            const selected = toRaw(leftArea.selectedItem)
            GitHubAPI.getContent({ filePath: path, branch: selected.name})
            .then(response => {
                mainArea.currentNode = {
                    ...response.data,
                    decodedData: helper.decodeBase64(response.data.content), 
                } // Decode base64 contentgg 

                if(mainArea.currentNode.url) {
                    const c = mainArea.currentNode.url.split('?ref=')
                    if(c.length) leftArea.selectedSavedTab = c[1]
                }
            })
            .catch(error => {
                console.log(error)
                mainArea.currentNode = {...initModel.mainArea.currentNode};
            });
        },
        async getTreeList(branch: string) {
            leftArea.isShowSelectSpinner = true
            leftArea.tree.length = 0
            leftArea.sha = ''
            leftArea.truncated = false

            await GitHubAPI.getTreeList(branch)
                .then(response => {
                    const { tree, sha, truncated } = response.data
                    leftArea.tree = [...tree]
                    leftArea.sha = sha
                    leftArea.truncated = truncated
                    leftArea.isShowSelectSpinner = false
                })
                .catch(error => {
                    leftArea.isShowSelectSpinner = false
                    console.error('API Error:', error)
                })
        },
        async getBranches() {
            leftArea.isShowSelectSpinner = true
            await GitHubAPI.branches()
                .then(response => {
                    const dataList : Branch[] = response.data
                    leftArea.select = [...dataList]
                    leftArea.processList = API.getIntializedTabList(dataList)
                    leftArea.isShowSelectSpinner = false
                    console.log(leftArea.processList)
                })
                .catch(e => {
                    console.error(e)
                    leftArea.isShowSelectSpinner = false
                })
        },
        clickItemInSaveView(node: Node) {
            mainArea.currentNode = {...node}
        },
        getIntializedTabList(dataList : Branch[]): Process[] {
            return dataList.map(x => {
                const { name } = x
                return {
                    name,
                    nodes: [],
                }
            })
        },
    }

    provide('leftArea', leftArea)
    provide('mainArea', mainArea)
    provide('isProgressVisible', hiddenArea)
    provide('API', API)

    onBeforeMount(() => API.getBranches())
</script>

<template>
    <div class="flex">
        <div class="p-[10px]">
            <h2 class="p-[8px]">Hello Jenkins !</h2>
            <slot :data="leftArea" name="leftArea"></slot>
        </div>
        <div>
            <slot :data="mainArea" name="mainArea"></slot>
        </div>
        <div>
            <slot :data="hiddenArea" name="hidden"></slot>
        </div>
    </div>
</template>

<style scoped>
</style>