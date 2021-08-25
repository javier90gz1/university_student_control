import * as actionTypes from './actions';

const initialState = {
   
    userId: -1,
    users: false,
    cityId:-1,
    cities:false,
    studentId:-1,
    students:false,
    professorId: -1,
    professors: false,
    groupId: -1,
    groups: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.RENDER_USERS:
            return {
                ...state,
                userId: action.userId
            };
        case actionTypes.RENDER_USERS_TABLE:
            return {
                ...state,
                users: !state.users
            };

        case actionTypes.RENDER_CITY:
            return {
                ...state,
                cityId: action.cityId
            };
        case actionTypes.RENDER_CITY_TABLE:
            return {
                ...state,
                cities: !state.cities
            };
        case actionTypes.RENDER_STUDENT:
            return {
                ...state,
                studentId: action.studentId
            };
        case actionTypes.RENDER_STUDENT_TABLE:
            return {
                ...state,
                students: !state.students
            };
        case actionTypes.RENDER_PROFESSOR:
            return {
                ...state,
                professorId: action.professorId
            };
        case actionTypes.RENDER_PROFESSOR_TABLE:
            return {
                ...state,
                professors: !state.professors
            };
        case actionTypes.RENDER_GROUP:
            return {
                ...state,
                groupId: action.groupId
            };
        case actionTypes.RENDER_GROUP_TABLE:
            return {
                ...state,
                groups: !state.groups
            };
        default:
            return state;
    }
};

export default reducer;