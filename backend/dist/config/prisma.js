"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// 'unknown' is used to avoid type errors when accessing the global object
const globalForPrisma = global;
// create a new PrismaClient instance if it doesn't exist, otherwise use the existing one
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient();
// if the environment is not production, set the global prisma instance to the prisma client
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma; // in development, save the instance for reuse
