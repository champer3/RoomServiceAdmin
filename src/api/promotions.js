import axios from "axios";
import { API_URL } from "../config";

export const PROMOTIONS_BASE = `${API_URL}/api/v1/promotions`;

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

export function listPromotions(params) {
  return axios.get(PROMOTIONS_BASE, {
    headers: authHeaders(),
    params,
  });
}

export function getPromotion(id) {
  return axios.get(`${PROMOTIONS_BASE}/${id}`, {
    headers: authHeaders(),
  });
}

export function createPromotion(body) {
  return axios.post(PROMOTIONS_BASE, body, {
    headers: authHeaders(),
  });
}

export function updatePromotion(id, body) {
  return axios.patch(`${PROMOTIONS_BASE}/${id}`, body, {
    headers: authHeaders(),
  });
}

export function deletePromotion(id) {
  return axios.delete(`${PROMOTIONS_BASE}/${id}`, {
    headers: authHeaders(),
  });
}
