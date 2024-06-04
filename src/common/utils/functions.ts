
export const createSlug = (str: string) => {
    return str.replace(/[،ًًًٌٍُِ\.\+\-_)(*&^%$#@!~'";:?><«»`ء]+/g, '')?.replace(/[\s]+/g, '-');
}

export const randomId = () => Math.random().toString(36).substring(2)

export function deleteInvalidPropertiesInObject(data = {}  , blackListFields = []){
    const nullishValues = ["", " ", "0", 0, null, undefined ]; 
    Object.keys(data).forEach(key => {
        if (blackListFields?.includes(key)) delete data[key];
        if (typeof data[key] === 'string') data[key] = data[key].trim();
        if (Array.isArray(data[key]) && data[key].length > 0) data[key] = data[key].map(item => item.trim());
        if (Array.isArray(data[key]) && data[key].length < 1) delete data[key];;
        if (nullishValues.includes(data[key])) delete data[key]
    })
}
