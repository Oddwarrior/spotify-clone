import { ACCESS_TOKEN, EXPIRES_IN, logout, TOKEN_TYPE } from "./common";

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;


const getAccesToken = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const tokenType = localStorage.getItem(TOKEN_TYPE);
    const expiresIn = localStorage.getItem(EXPIRES_IN);

    if (Date.now() < expiresIn) {
        return { accessToken, tokenType }
    }
    else {
        logout();
    }
}
const createAPIConfig = ({ accessToken, tokenType }, method = "GET") => {
    return {
        headers: {
            Authorization: `${tokenType} ${accessToken}`
        },
        method
    }
}

export const fetchRequest = async (endpoint) => {
    const url = `${BASE_API_URL}/${endpoint}`;
    const result = await fetch(url, createAPIConfig(getAccesToken()));
    return result.json();
}

