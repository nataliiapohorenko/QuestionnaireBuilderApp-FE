import { useHttp } from "../hooks/http.hook";
import config from '../config.js';

const useQuestionnaireService = () => {
    const { request} = useHttp();
    const _apiBase=`${config.apiUrl}/questionnaire`;
    const _apiResp=`${config.apiUrl}/responce`;

    const getPaginatedQuestionnaires = async (page = 1, limit = 6, sortBy = 'createdAt') => {
        const res = await request(`${_apiBase}?page=${page}&limit=${limit}&sortBy=${sortBy}`);
        return res;
    };

    const getQuestionnaireById = async (id) => {
        const res = await request(`${_apiBase}/${id}`);
        return res;
    };

    const createNewQuestionnaire = async (body) => {
        const res = await request(`${_apiBase}`, 'POST', body);
        return res;
    };

    const updateQuestionnaire = async (id, body) => {
        const res = await request(`${_apiBase}/${id}`, 'PUT', body);
        return res;
    };

    const deleteQuestionnaire = async (id) => {
        const res = await request(`${_apiBase}/${id}`, 'DELETE');
        return res;
    };

    const sendQuizAnswers = async (id, body) => {
        const res = await request(`${_apiResp}/${id}`, 'POST', body);
        return res;
    };

    const getStatistics = async (id) => {
        const res = await request(`${_apiBase}/statistics/${id}`);
        return res;
    };

    return {getPaginatedQuestionnaires, createNewQuestionnaire, deleteQuestionnaire, 
        getQuestionnaireById, updateQuestionnaire, sendQuizAnswers, getStatistics};
}

export default useQuestionnaireService;