import express from "express";
import { readFile } from 'fs/promises';
const {port} = JSON.parse(await readFile(new URL('./config.json', import.meta.url)));
import Server from "./src/Server.js";
new Server(express,port);


