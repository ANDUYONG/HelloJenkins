/**
 * 로그 데이터의 상세 정보
 */
export interface LogData {
    text: string;
    startByte: number;
    endByte: number;
    nodeIsActive: boolean;
}

/**
 * 개별 로그 항목
 */
export interface LogItem {
    id: string
    log: LogDetail
}

export interface LogDetail {
    status: string;
    data: LogData;
}

/**
 * 파이프라인 스테이지의 세부 정보
 */
export interface PipelineStage {
    id: string;
    name: string;
    state: 'success' | 'running' | 'failure' | 'notExecuted' | 'aborted' | 'notReady' | string;
    type: 'STAGE' | 'PARALLEL_STAGE' | 'AGENT' | string;
    title: string;
    pauseDurationMillis: number;
    startTimeMillis: number;
    totalDurationMillis?: number; // totalDurationMillis는 실행 중인 스테이지에서는 없을 수 있으므로 optional
    children: any[]; // 자식 노드의 타입은 복잡할 수 있으나, 여기서는 빈 배열로 보이므로 간단히 any[]로 처리
    isSequential: boolean;
    synthetic: boolean;
    placeholder: boolean;
    agent: string;
    url: string;
    log: string;
}

/**
 * 파이프라인 트리 데이터 섹션
 */
export interface PipelineTreeData {
    complete: boolean
    stages: PipelineStage[]
}

/**
 * 파이프라인 트리 구조
 */
export interface PipelineTree {
    status: string
    data: PipelineTreeData
    currentLogTab: string | null
    currentLogItem: string | null
}

/**
 * 전체 응답 JSON의 최상위 인터페이스
 */
export interface JenkinsPipelineInfo {
    jobName: string
    branchName: string
    buildNumber: number
    tree: PipelineTree
    logs: LogItem[]
    totalLog: string
}

/**
 * ProcessDataProvider 타입 정의
 */
export interface ProcessDataProvider {
    currentItem: JenkinsPipelineInfo | null
    items: JenkinsPipelineInfo[]
    isTotalProcess: boolean
}

/**
 * ProcessHeaderTab 타입 정의
 */
export interface ProcessHeaderTab {
    branchName: string
}

/**
 * ProcessHeaderTab 타입 정의
 */
export interface ProcessHeaderTab {
    branchName: string
}

/**
 * 링크의 Href URL을 나타내는 인터페이스
 */
interface Href {
  href: string;
}

/**
 * API 링크들을 나타내는 인터페이스
 * 일부 속성은 최상위 노드에만 있고, 일부는 하위 노드에만 있을 수 있으므로 선택적 속성으로 정의합니다.
 */
interface Links {
  self: Href;
  log?: Href;
  console?: Href;
}

/**
 * 파이프라인 스테이지(Stage) 내의 개별 스텝(Step) 정보를 나타내는 인터페이스
 */
interface StageFlowNode {
  _links: Links;
  id: string;
  name: string;
  execNode: string;
  status: 'SUCCESS' | 'FAILURE' | 'RUNNING' | string; // 가능한 상태를 명시할 수 있음
  parameterDescription?: string; // 스크립트 내용 등, 일부 Step에만 존재하므로 선택적 속성입니다.
  startTimeMillis: number;
  durationMillis: number;
  pauseDurationMillis: number;
  parentNodes: string[];
}

/**
 * Jenkins Pipeline의 특정 노드(일반적으로 Stage) 상세 정보를 나타내는 최상위 인터페이스
 */
export interface PipelineNodeDetails {
  _links: Links;
  id: string;
  name: string;
  execNode: string;
  status: 'SUCCESS' | 'FAILURE' | 'RUNNING' | string;
  startTimeMillis: number;
  durationMillis: number;
  pauseDurationMillis: number;
  stageFlowNodes: StageFlowNode[]; // 해당 Stage에 포함된 Step들의 목록
}

const INIT_LOG = {
    id: 'Info', // 빈 문자열 (노드 ID)
    log: {
        status: 'NOT_LOADED', // 또는 'SUCCESS', 'FAILURE' 등 상태에 맞는 초기값
        data: {
            text: '', // 빈 문자열
            startByte: 0,
            endByte: 0,
            nodeIsActive: false,
        }, // 위에서 정의한 LogData 초기값 사용
    }
}

const INIT_TOTAL_LOGS = [
    {
        id: 'feature/test1', // 빈 문자열 (노드 ID)
        log: {
            status: 'NOT_READY', // 또는 'SUCCESS', 'FAILURE' 등 상태에 맞는 초기값
            data: {
                text: '', // 빈 문자열
                startByte: 0,
                endByte: 0,
                nodeIsActive: false,
            }, // 위에서 정의한 LogData 초기값 사용
        },
    },
    {
        id: 'feature/test2', // 빈 문자열 (노드 ID)
        log: {
            status: 'NOT_READY', // 또는 'SUCCESS', 'FAILURE' 등 상태에 맞는 초기값
            data: {
                text: '', // 빈 문자열
                startByte: 0,
                endByte: 0,
                nodeIsActive: false,
            }, // 위에서 정의한 LogData 초기값 사용
        },
    },
    {
        id: 'feature/test3', // 빈 문자열 (노드 ID)
        log: {
            status: 'NOT_READY', // 또는 'SUCCESS', 'FAILURE' 등 상태에 맞는 초기값
            data: {
                text: '', // 빈 문자열
                startByte: 0,
                endByte: 0,
                nodeIsActive: false,
            }, // 위에서 정의한 LogData 초기값 사용
        },
    },
    {
        id: 'dev', // 빈 문자열 (노드 ID)
        log: {
            status: 'NOT_READY', // 또는 'SUCCESS', 'FAILURE' 등 상태에 맞는 초기값
            data: {
                text: '', // 빈 문자열
                startByte: 0,
                endByte: 0,
                nodeIsActive: false,
            }, // 위에서 정의한 LogData 초기값 사용
        },
    },
    {
        id: 'main', // 빈 문자열 (노드 ID)
        log: {
            status: 'NOT_READY', // 또는 'SUCCESS', 'FAILURE' 등 상태에 맞는 초기값
            data: {
                text: '', // 빈 문자열
                startByte: 0,
                endByte: 0,
                nodeIsActive: false,
            }, // 위에서 정의한 LogData 초기값 사용
        },
    },
]

const INIT_STAGE = {
    id: 'Info',
    name: 'Info',
    state: 'NOT_EXECUTED', // 초기 상태
    type: 'STAGE',
    title: '',
    pauseDurationMillis: 0,
    startTimeMillis: 0,
    // totalDurationMillis는 optional이므로 초기화 시 생략할 수 있습니다.
    children: [],
    isSequential: false,
    synthetic: false,
    placeholder: false,
    agent: '',
    url: '',
    log: '',
}

const INIT_TOTAL_STAGES = [
    {
        id: 'feature/test1',
        name: 'feature/test1',
        state: 'NOT_EXECUTED', // 초기 상태
        type: 'STAGE',
        title: '',
        pauseDurationMillis: 0,
        startTimeMillis: 0,
        // totalDurationMillis는 optional이므로 초기화 시 생략할 수 있습니다.
        children: [],
        isSequential: false,
        synthetic: false,
        placeholder: false,
        agent: '',
        url: '',
        log: '',
    },
    {
        id: 'feature/test2',
        name: 'feature/test2',
        state: 'NOT_EXECUTED', // 초기 상태
        type: 'STAGE',
        title: '',
        pauseDurationMillis: 0,
        startTimeMillis: 0,
        // totalDurationMillis는 optional이므로 초기화 시 생략할 수 있습니다.
        children: [],
        isSequential: false,
        synthetic: false,
        placeholder: false,
        agent: '',
        url: '',
        log: '',
    },
    {
        id: 'feature/test3',
        name: 'feature/test3',
        state: 'NOT_EXECUTED', // 초기 상태
        type: 'STAGE',
        title: '',
        pauseDurationMillis: 0,
        startTimeMillis: 0,
        // totalDurationMillis는 optional이므로 초기화 시 생략할 수 있습니다.
        children: [],
        isSequential: false,
        synthetic: false,
        placeholder: false,
        agent: '',
        url: '',
        log: '',
    },
    {
        id: 'dev',
        name: 'dev',
        state: 'NOT_EXECUTED', // 초기 상태
        type: 'STAGE',
        title: '',
        pauseDurationMillis: 0,
        startTimeMillis: 0,
        // totalDurationMillis는 optional이므로 초기화 시 생략할 수 있습니다.
        children: [],
        isSequential: false,
        synthetic: false,
        placeholder: false,
        agent: '',
        url: '',
        log: '',
    },
    {
        id: 'main',
        name: 'main',
        state: 'NOT_EXECUTED', // 초기 상태
        type: 'STAGE',
        title: '',
        pauseDurationMillis: 0,
        startTimeMillis: 0,
        // totalDurationMillis는 optional이므로 초기화 시 생략할 수 있습니다.
        children: [],
        isSequential: false,
        synthetic: false,
        placeholder: false,
        agent: '',
        url: '',
        log: '',
    },
]

const INIT_HEADER_TAB = [
    {
        branchName: 'Total',
    },
    {
        branchName: 'feature/test1',
    },
    {
        branchName: 'feature/test2',
    },
    {
        branchName: 'feature/test3',
    },
    {
        branchName: 'dev',
    },
    {
        branchName: 'main',
    },
]

const INIT_PIPELINES = [
    {
        jobName: 'Ready', // 작업 이름은 빈 문자열로 초기화
        branchName: 'Total',
        buildNumber: -1, // 빌드 번호는 0으로 초기화
        tree: {
            status: 'NOT_EXECUTED', // 초기 상태는 실행되지 않음으로 설정
            data: {
                complete: false, // 아직 완료되지 않음
                stages: INIT_TOTAL_STAGES // 스테이지 목록은 빈 배열
            }
        },
        logs: INIT_TOTAL_LOGS,
        totalLog: '',
    } as JenkinsPipelineInfo,
    {
        jobName: 'Ready', // 작업 이름은 빈 문자열로 초기화
        branchName: 'feature/test1',
        buildNumber: -1, // 빌드 번호는 0으로 초기화
        tree: {
            status: 'NOT_READY', // 초기 상태는 실행되지 않음으로 설정
            data: {
                complete: false, // 아직 완료되지 않음
                stages: [INIT_STAGE] // 스테이지 목록은 빈 배열
            }
        },
        logs: [INIT_LOG], // 로그 목록은 빈 배열
        totalLog: '',
    } as JenkinsPipelineInfo,
    {
        jobName: 'Ready', // 작업 이름은 빈 문자열로 초기화
        branchName: 'feature/test2',
        buildNumber: -1, // 빌드 번호는 0으로 초기화
        tree: {
            status: 'NOT_READY', // 초기 상태는 실행되지 않음으로 설정
            data: {
                complete: false, // 아직 완료되지 않음
                stages: [INIT_STAGE] // 스테이지 목록은 빈 배열
            }
        },
        logs: [INIT_LOG], // 로그 목록은 빈 배열
        totalLog: '',
    } as JenkinsPipelineInfo,
    {
        jobName: 'Ready', // 작업 이름은 빈 문자열로 초기화
        branchName: 'feature/test3',
        buildNumber: -1, // 빌드 번호는 0으로 초기화
        tree: {
            status: 'NOT_READY', // 초기 상태는 실행되지 않음으로 설정
            data: {
                complete: false, // 아직 완료되지 않음
                stages: [INIT_STAGE] // 스테이지 목록은 빈 배열
            }
        },
        logs: [INIT_LOG], // 로그 목록은 빈 배열
        totalLog: '',
    } as JenkinsPipelineInfo,
    {
        jobName: 'NotReady', // 작업 이름은 빈 문자열로 초기화
        branchName: 'dev',
        buildNumber: -1, // 빌드 번호는 0으로 초기화
        tree: {
            status: 'NOT_READY', // 초기 상태는 실행되지 않음으로 설정
            data: {
                complete: false, // 아직 완료되지 않음
                stages: [INIT_STAGE] // 스테이지 목록은 빈 배열
            }
        },
        logs: [INIT_LOG], // 로그 목록은 빈 배열
        totalLog: '',
    } as JenkinsPipelineInfo,
    {
        jobName: 'NotReady', // 작업 이름은 빈 문자열로 초기화
        branchName: 'main',
        buildNumber: -1, // 빌드 번호는 0으로 초기화
        tree: {
            status: 'NOT_READY', // 초기 상태는 실행되지 않음으로 설정
            data: {
                complete: false, // 아직 완료되지 않음
                stages: [INIT_STAGE] // 스테이지 목록은 빈 배열
            }
        },
        logs: [INIT_LOG], // 로그 목록은 빈 배열
        totalLog: '',
    } as JenkinsPipelineInfo,
]

const INIALIZER = {
    pipelineInfoItems: INIT_PIPELINES,
    headerTabs: INIT_HEADER_TAB,
    stage: INIT_STAGE,
    totalStages: INIT_TOTAL_STAGES,
    logs: INIT_LOG,
    totalLogs: INIT_TOTAL_LOGS,
}

export { INIALIZER }