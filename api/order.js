import {createHandler} from '../server/http.mjs';
const handle=createHandler('order');
export default {fetch:handle};
