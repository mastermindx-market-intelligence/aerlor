import {createHandler} from '../server/http.mjs';
const handle=createHandler('checkout');
export default {fetch:handle};
