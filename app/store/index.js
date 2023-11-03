import { proxy } from "valtio";

const state = proxy({
    user: ""
})

export default state;