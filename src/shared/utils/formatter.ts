export function objectListToMap<T, K>(key: string, objects: any[]): Map<T, K> {
    let objectMap: Map<T, K> = new Map();
    for (let object of objects) {
        objectMap.set(object[key], object);
    }
    return objectMap;
}

export function objectOverwriteAttributes(fromObject: any, toObject: any): any {
    for (let attribute of fromObject.keys) {
        if (toObject.hasOwnProperty(attribute)) {
            toObject[attribute] = fromObject[attribute];
        }
    }
    return toObject;
}

export function jsonConcat(o1: any, o2: any) {
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
}

export function titleCase(str: string) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}
