import {createHandler} from '../server/http.mjs';
const handle=createHandler('webhook');
export default {fetch:handle};
