"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const eventRegistration_1 = __importDefault(require("./eventRegistration"));
const eventFeedback_1 = __importDefault(require("./eventFeedback"));
const eventSchedule_1 = __importDefault(require("./eventSchedule"));
const post_1 = __importDefault(require("./post"));
const resource_1 = __importDefault(require("./resource"));
const EventSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    resources: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Resource' }],
    posts: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Post' }],
});
const Event = mongoose_1.default.model('Event', EventSchema);
EventSchema.pre('deleteOne', { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventId = this._id;
        yield eventRegistration_1.default.deleteMany({ event: eventId });
        yield eventFeedback_1.default.deleteMany({ event: eventId });
        yield eventSchedule_1.default.deleteMany({ event: eventId });
        yield post_1.default.deleteMany({ _id: { $in: this.posts } });
        yield resource_1.default.deleteMany({ _id: { $in: this.resources } });
        next();
    });
});
exports.default = Event;
