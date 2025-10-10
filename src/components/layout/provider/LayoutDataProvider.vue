<script setup lang="ts">
    import GitHubAPI from '@/http/git-hub-api';
    import { onBeforeMount, provide, reactive } from 'vue'
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

    export interface API {
        commitAndDeploy: () => void
        save: () => void
        detail: (path: string) => void
        init: () => void

        clickItemInSaveView: (node: Node) => void
    }

    const initModel: LayoutDataProviderProps = {
        leftArea: {
            sha: '',
            truncated: false,
            tree: [],
            msg: '',
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
        commitAndDeploy() {
            if(!mainArea.savedNodes.length) return alert('수정된 파일이 존재하지 않습니다.')
            else if(!leftArea.msg) return alert('커밋 메세지를 입력하세요.')
            else if(confirm('커밋 및 배포 하시겠습니까?')) {
                GitHubAPI.deployPages().then(response => {
                    alert('배포가 완료되었습니다.');
                    hiddenArea.isVisible = false
                })
                .catch(error => {
                    alert('배포 중 오류가 발생했습니다. 다시 시도해주세요.');
                    hiddenArea.isVisible = false
                });
            }
        },
        save() {
            if(confirm('변경 내용을 저장하시겠습니까?')) {
                const nodes = mainArea.savedNodes
                const curr = mainArea.currentNode
                
                // 1. 기존에 저장된 배열에 존재하는지
                // - 저장된 노드가 있다면 노드의 내용을 바꾼다.
                // 2. 저장된 노드가 없다면 추가.
                const exist = nodes.find(x => x.path === curr.path) 
                if(exist) {
                    const idx = nodes.findIndex(x => x === exist)
                    const target = mainArea.savedNodes[idx]
                    target.decodedData = curr.decodedData
                    target.encodedData = helper.utf8ToBase64(curr.decodedData) 
                    target.content = helper.utf8ToBase64(curr.decodedData)
                } else {
                    curr.content = helper.utf8ToBase64(curr.decodedData)

                    nodes.push(curr)
                }
            }
        },
        detail(path: string) {
            GitHubAPI.getContent({ filePath: path, branch: 'test'})
            .then(response => {
            mainArea.currentNode = {
                ...response.data,
                decodedData: helper.decodeBase64(response.data.content), 
            } // Decode base64 contentgg 
            })
            .catch(error => {
                console.log(error)
                mainArea.currentNode = {...initModel.mainArea.currentNode};
            });
        },
        async init() {
            await GitHubAPI.getTreeList()
                .then(response => {
                    Object.assign(leftArea, { ...response.data })
                })
                .catch(error => {
                    console.error('API Error:', error)
                })
        },

        clickItemInSaveView(node: Node) {
            mainArea.currentNode = {...node}
        },
    }

    provide('leftArea', leftArea)
    provide('mainArea', mainArea)
    provide('isProgressVisible', hiddenArea)
    provide('API', API)

    onBeforeMount(API.init)
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
    div {
        background: #23272e;
        color: white;
    }
</style>