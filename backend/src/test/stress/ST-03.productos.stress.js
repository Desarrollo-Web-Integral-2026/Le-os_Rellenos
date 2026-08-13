import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';
import { Trend } from 'k6/metrics';

const BASE_URL = 'http://localhost:3000/api/productos/listar';

// Métricas independientes para cada nivel de carga
const latency10 = new Trend('latency_10');
const latency60 = new Trend('latency_60');
const latency110 = new Trend('latency_110');
const latency160 = new Trend('latency_160');
const latency210 = new Trend('latency_210');
const latency260 = new Trend('latency_260');
const latency300 = new Trend('latency_300');

export const options = {
  scenarios: {
    vus_10: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
      startTime: '0s',
    },

    vus_60: {
      executor: 'constant-vus',
      vus: 60,
      duration: '30s',
      startTime: '35s',
    },

    vus_110: {
      executor: 'constant-vus',
      vus: 110,
      duration: '30s',
      startTime: '70s',
    },

    vus_160: {
      executor: 'constant-vus',
      vus: 160,
      duration: '30s',
      startTime: '105s',
    },

    vus_210: {
      executor: 'constant-vus',
      vus: 210,
      duration: '30s',
      startTime: '140s',
    },

    vus_260: {
      executor: 'constant-vus',
      vus: 260,
      duration: '30s',
      startTime: '175s',
    },

    vus_300: {
      executor: 'constant-vus',
      vus: 300,
      duration: '30s',
      startTime: '210s',
    },
  },

  thresholds: {
    http_req_duration: ['p(95)<3000'],
  },
};

export default function () {
  const res = http.get(BASE_URL);

  check(res, {
    'status es 200': (r) => r.status === 200,
    'tiempo de respuesta < 3000ms': (r) =>
      r.timings.duration < 3000,
  });

  const duration = res.timings.duration;
  const scenario = exec.scenario.name;

  switch (scenario) {
    case 'vus_10':
      latency10.add(duration);
      break;

    case 'vus_60':
      latency60.add(duration);
      break;

    case 'vus_110':
      latency110.add(duration);
      break;

    case 'vus_160':
      latency160.add(duration);
      break;

    case 'vus_210':
      latency210.add(duration);
      break;

    case 'vus_260':
      latency260.add(duration);
      break;

    case 'vus_300':
      latency300.add(duration);
      break;
  }

  sleep(1);
}