import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    creacion_concurrente: {
      executor: 'constant-vus',
      vus: 100,
      duration: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'], // tasa de error < 5%
  },
};

const BASE_URL = 'http://localhost:3000/api/productos/crear';
const CATEGORIA_ID = '6a75f9f1b7240bc560813c45';

export default function () {
  const idUnico = `${__VU}-${__ITER}-${Date.now()}`;

  const payload = JSON.stringify({
    nombre: `Leño Prueba ST-02 ${idUnico}`,
    descripcion: 'Producto generado por prueba de esfuerzo k6',
    precio: 55.0,
    categoria: CATEGORIA_ID,
    disponible: true,
    stock: 20,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(BASE_URL, payload, params);

  check(res, {
    'status es 201': (r) => r.status === 201,
    'respuesta trae producto creado': (r) => {
      try {
        return JSON.parse(r.body).data !== undefined;
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}