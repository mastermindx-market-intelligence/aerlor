import {createHandler} from '../server/http.mjs';
const handle=createHandler('config');
export default {fetch:handle};
