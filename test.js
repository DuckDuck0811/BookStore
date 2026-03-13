import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 1,
  iterations: 1,
  insecureSkipTLSVerify: true,
};

const url = "https://anvl.autumus.com:9881/api/v1/notification/update";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxOTllNWQzLTdlMjctNzQxMi1hMDNjLTU3YWMxYzFlMTZlYyIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiZXhwIjoxNzY5NzU2NzQ1LCJpYXQiOjE3NjkxNTE5NDV9.oKY7NhFmfwbiA7XuswHpOa0wRZkQTDVWE9JzpxlKz04";

const basePayload = {
  event_code: 653,
  message: "RACK_LOCK_ERR_DEVICE_TCP_RECONNECT",
  device_name: "Rack-Err3",
  zone_code: "TT1.A",
  citizen_identity: "012345678918",
  name: "K6 Load Test",
  direction: "EXIT",
  authen_type: "CARD",
  bio_id: "118",
  door_status: "UNLOCKED",
  from_system: "RACK_LOCK",
  sensor_id: "SENSOR-18",
  channel_id: "CH-18",
  cluster_id: "CL-18",
  lock_id: "18",
  rack_code: "RACK-R",
  gate_id: "GATE-18",
  lane_id: "LANE-18",
  vehicle_direction: 2,
  lpr: "79B-88990",
  vehicle_type: 3,
  action_status: 1,
  linked_camera: "CAM-18",
  priority_type: 5,
  system: 6,
  images: [],
  uavs: []
};

const params = {
  headers: {
    "Content-Type": "application/json",
    "Cookie": `access_token=${TOKEN}`,
  },
};

export default function () {
  const now = Math.floor(Date.now() / 1000).toString();

  const payload = JSON.stringify({
    ...basePayload,
    event_id: `E-${__VU}-${__ITER}`,
    device_id: `DEV-${__VU}-${__ITER}`,
    mac: `AA:BB:CC:DD:EE:${__VU}`,
    timestamp: now,
    created_at: now,
    updated_at: now,
  });

  const res = http.post(url, payload, params);

  check(res, {
    "Success": (r) => r.status === 200 || r.status === 201,
  });
}