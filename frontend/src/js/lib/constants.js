const HOSTNAME = process.env.REACT_APP_HOSTNAME;
const API_PREFIX = 'api';
const API_VERSION = 'v1';

export const SERVER_URL = `${API_PREFIX}/${API_VERSION}`;
export const HOME_DRAWER_PATHS= {
    MERCHANTS:"merchants",
    MENUITEMS:"menu-items",
    SETTINGS:"settings",
    NEW_MERCHANT:"newMerchant",
    NEW_ITEM:"newItem",
}
export const PAGE_LIMIT={
    ALL_MERCHANTS:10,
}
export const FORM_TYPES={
    FORM_ONE:"formOne",
    FORM_TWO:"formTwo",
    FORM_THREE:"formThree",
    FORM_FOUR:"formFour",
}