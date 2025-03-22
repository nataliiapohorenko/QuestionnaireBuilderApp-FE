import { useCallback } from "react";
import axios from "axios";

export const useHttp = () => {
    const request = useCallback(async (url, method = 'GET', body = {})=> {
    const response = await axios({url, method, data:body});
    return response.data;
    }, []);

    return { request}
}
