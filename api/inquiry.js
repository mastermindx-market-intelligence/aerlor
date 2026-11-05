import {createHandler} from '../server/http.mjs';
const handle=createHandler('inquiry');
export default {fetch:handle};
