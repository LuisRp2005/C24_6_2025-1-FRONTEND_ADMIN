import API from "./api";
import { Module } from "../models/Module";
import { ModuleRequest } from "../models/ModuleRequest";

export const createModule = (data: ModuleRequest) => API.post('/modules', data);

export const getModule = () => API.get<Module[]>('/modules');

export const updateModule = (id: number, data: ModuleRequest) => API.put(`/modules/${id}`, data)

export const getModuleById = (id: number) => API.get<ModuleRequest>(`/modules/${id}`);

export const deleteModule = (id: number) => API.delete(`/modules/${id}`);
