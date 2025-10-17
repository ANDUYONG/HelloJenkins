/**
 * 로그 데이터의 상세 정보
 */
interface LogData {
    text: string;
    startByte: number;
    endByte: number;
    nodeIsActive: boolean;
}

/**
 * 개별 로그 항목
 */
interface LogItem {
    id: string;
    log: {
        status: string;
        data: LogData;
    };
}

/**
 * 파이프라인 스테이지의 세부 정보
 */
interface PipelineStage {
    id: string;
    name: string;
    state: 'success' | 'running' | 'failure' | 'notExecuted' | 'aborted' | string;
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
}

/**
 * 파이프라인 트리 데이터 섹션
 */
interface PipelineTreeData {
    complete: boolean;
    stages: PipelineStage[];
}

/**
 * 파이프라인 트리 구조
 */
interface PipelineTree {
    status: string;
    data: PipelineTreeData;
}

/**
 * 전체 응답 JSON의 최상위 인터페이스
 */
interface JenkinsPipelineInfo {
    jobName: string;
    buildNumber: number;
    tree: PipelineTree;
    logs: LogItem[];
}

const INIALIZER = {
    pipelineInfo: {
        jobName: '', // 작업 이름은 빈 문자열로 초기화
        buildNumber: 0, // 빌드 번호는 0으로 초기화
        tree: {
            status: 'NOT_EXECUTED', // 초기 상태는 실행되지 않음으로 설정
            data: {
                complete: false, // 아직 완료되지 않음
                stages: [] // 스테이지 목록은 빈 배열
            }
        },
        logs: [] // 로그 목록은 빈 배열
    } as JenkinsPipelineInfo
    // `as JenkinsPipelineInfo`는 TypeScript가 구조를 정확히 인식하도록 돕습니다.
}