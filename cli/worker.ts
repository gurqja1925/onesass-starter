/**
 * 인터랙티브 모드용 Worker
 * 실시간 로그 전송 지원
 */
import { config } from 'dotenv';
config(); // .env 파일 로드

import { parentPort, workerData } from 'worker_threads';
import { runCodingTask } from './agent/coding';

if (parentPort) {
  const { prompt, modelId } = workerData;

  runCodingTask(prompt, {
    modelId,
    maxSteps: 100,
    onLog: (log) => {
      // 실시간으로 로그 전송
      parentPort!.postMessage({
        type: 'log',
        log: {
          timestamp: log.timestamp,
          level: log.level,
          message: log.message,
        },
      });
    },
  })
    .then(result => {
      parentPort!.postMessage({
        type: 'done',
        success: result.success,
        result: result.result,
        usage: result.usage,
      });
    })
    .catch(err => {
      parentPort!.postMessage({
        type: 'done',
        success: false,
        result: err.message,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      });
    });
}
