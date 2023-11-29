export const enum Type {
    ACCOUNT = 1,
    CONTACT = 2,
    INVOICEITEM = 79,
    FACEBOOKCONNECTION = 107,
    PROVIDERVERIFICATION = 111,
    UI = 112,
    AUDITLOG = 109,
    RECORDLAYOUT = 108,
    WFRULE = 55,
    CRMORDER = 13,
    CONTRACT = 28,
    INVOICECREDIT = 85,
    INVOICENO = 81,
    INVOICERENO = 84,
    INVOICEDRAFT = 82,
    ACTIVITYLOG = 102,
    DASHBOARD = 92,
    ARTICLE = 76,
    PRODUCT = 14,
    OPPORTUNITY = 4,
    CALENDARRESOURCE = 114,
    TASK = 10,
    COMPETITOR = 8,
    ACTIVITY = 6,
    PROJECT = 46,
    INVOICERECEIPTITEM = 80,
    TRANSACTIONITEM = 90,
    INVOICERECEIPT = 83,
    CAMPAIGN = 67,
    CASES = 5,
    ACCOUNTPRODUCT = 33,
    CALLLOG = 100,
    ATTENDANCECLOCK = 101,
    INVOICE = 78,
    INVOICEDELIVERY = 86,
    CONVERSATION = 104,
    WIDGET = 75,
    EMAILMESSAGE = 103,
    NOTE = 7,
    IPRESTRICTION = 89,
    ROLE = 64,
    BUSINESSUNIT = 23,
    LINK = 77,
    CRMUSERLOGIN = 70,
    DOC = 11,
    CRMUSER = 9,
    CRMORDERITEM = 17,
    ORG = 25,
    MDOBJECT = 58,
    SYSTEMFIELD = 73,
    SMSTEMPLATE = 110,
    PRINTTEMPLATE = 27,
    TEXTTEMPLATE = 106,
    TEAMINBOX = 105,
    VIEWDESIGNER = 30,
}

export class Fireberry {
    private apiToken?: string;
    private baseUrl: string;

    constructor(apiToken?: string) {
        this.apiToken = apiToken;
        this.baseUrl = apiToken ? "https://api.fireberry.com" : "";
    }

    //Utils
    private async sendRequest(url: string, method: string, data: any = {}): Promise<{ data?: any; error?: boolean }> {
        try {
            const headers: any = {
                "Content-Type": "application/json",
            };

            // Add tokenid header if apiToken is exists
            if (this.apiToken) {
                headers["tokenid"] = this.apiToken;
            }

            let options: any = {
                method,
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: headers,
                redirect: "follow",
                referrerPolicy: "no-referrer",
            };

            if (method !== "GET" && method !== "DELETE") {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);
            if (!response.ok) {
                return { error: true };
            }

            return { data: await response.json() };
        } catch (error) {
            return { error: true };
        }
    }
    private validateInputs(args: { [key: string]: any }) {
        for (let key in args) {
            if (!args[key]) {
                console.error(`${key} is required`);
                return false;
            }
        }
        return true;
    }

    //ObjectTypes
    private async createObjectType(name: string, collectionname: string) {
        if (!this.validateInputs({ name, collectionname })) {
            return null;
        }

        const url = `${this.baseUrl}/api/v2/record/58`;
        const dataResponse = await this.sendRequest(url, "POST", { name, collectionname });
        if (dataResponse.error) {
            return null;
        }
        const { record } = dataResponse.data;
        return record;
    }
    private async updateObjectType(objecttype: Type, data: { name?: string; collectionname?: string }) {
        if (!this.validateInputs({ objecttype, data })) {
            return null;
        }

        const url = `${this.baseUrl}/api/record/58/${objecttype}`;
        const dataResponse = await this.sendRequest(url, "PUT", data);
        if (dataResponse.error) {
            return null;
        }
        const { record } = dataResponse.data;
        return record;
    }
    private async deleteObjectType(objecttype: Type) {
        if (!this.validateInputs({ objecttype })) {
            return null;
        }

        const url = `${this.baseUrl}/api/record/58/${objecttype}`;
        return await this.sendRequest(url, "DELETE");
    }
    //Objects
    private async createObject(objecttype: Type, data: any) {
        if (!this.validateInputs({ objecttype, data })) {
            return null;
        }

        const url = `${this.baseUrl}/api/record/${objecttype}`;
        const dataResponse = await this.sendRequest(url, "POST", data);
        if (dataResponse.error) {
            return null;
        }
        const { Record } = dataResponse.data.data;
        return Record;
    }
    private async getAllObjects() {
        const url = `${this.baseUrl}/metadata/records`;
        const dataResponse = await this.sendRequest(url, "GET");
        if (dataResponse.error) {
            return [];
        }
        const { data } = dataResponse.data || { data: [] };
        return data;
    }
    private async updateObject(objecttype: Type, objectid: string, data: any) {
        if (!this.validateInputs({ objecttype, objectid, data })) {
            return null;
        }
        const url = `${this.baseUrl}/api/record/${objecttype}/${objectid}`;
        const dataResponse = await this.sendRequest(url, "PUT", data);
        if (dataResponse.error) {
            return null;
        }
        const { record } = dataResponse.data;
        return record;
    }
    private async deleteObject(objecttype: Type, objectid: string) {
        if (!this.validateInputs({ objecttype, objectid })) {
            return null;
        }

        const url = `${this.baseUrl}/api/record/${objecttype}/${objectid}`;
        return await this.sendRequest(url, "DELETE");
    }
    private async getObjectData(objecttype: Type, query = "", page_number = 1, page_size = 500, sort_type = "desc", sort_by = "createdon", accumulator: any[] = []): Promise<any[]> {
        if (!this.validateInputs({ objecttype })) {
            return [];
        }

        const url = `${this.baseUrl}/api/query`;
        const dataResponse = await this.sendRequest(url, "POST", {
            fields: "",
            objecttype,
            query,
            page_size,
            page_number,
            sort_by,
            sort_type,
        });
        if (dataResponse.error) {
            return [];
        }
        const { Data } = dataResponse.data.data || { Data: [] };

        if (Data.length === 500) {
            return this.getObjectData(objecttype, query, page_number + 1, page_size, sort_type, sort_by, [...accumulator, ...Data]);
        } else {
            return [...accumulator, ...Data];
        }
    }
    private async getFirst(objecttype: Type, query = "", sort_type = "desc", sort_by = "createdon") {
        if (!this.validateInputs({ objecttype })) {
            return null;
        }

        const data = await this.getObjectData(objecttype, query, 1, 1, sort_type, sort_by);
        return data[0] || null;
    }
    private async getById(objecttype: Type, objectid: string) {
        if (!this.validateInputs({ objecttype, objectid })) {
            return null;
        }

        const url = `${this.baseUrl}/api/record/${objecttype}/${objectid}`;
        const dataResponse = await this.sendRequest(url, "GET", { objecttype, objectid });
        if (!dataResponse || dataResponse.error) {
            return null;
        }
        const { Record } = dataResponse.data.data;
        return Record;
    }

    //Fields
    private async createField(objecttype: Type, fieldType: string, data: { fieldName: string; label: string }) {
        if (!this.validateInputs({ objecttype, fieldType, data })) {
            return null;
        }

        data.fieldName = "pcf" + data.fieldName;
        const url = `${this.baseUrl}/api/v2/system-field/${objecttype}/${fieldType}`;
        const dataResponse = await this.sendRequest(url, "POST", data);
        if (dataResponse.error) {
            return null;
        }
        const { systemField } = dataResponse.data.data;
        return systemField;
    }
    private async updateField(objecttype: Type, fieldid: string, data: { label?: string; autoComplete?: boolean; defaultValue?: string; follow?: boolean; maxLength?: number }) {
        if (!this.validateInputs({ objecttype, fieldid, data })) {
            return null;
        }

        if (data.maxLength && (data.maxLength < 0 || data.maxLength > 200)) {
            console.error("maxLength must be between 0 and 200");
            return null;
        }

        const url = `${this.baseUrl}/api/v2/system-field/${objecttype}/${fieldid}`;
        const dataResponse = await this.sendRequest(url, "PUT", data);
        if (dataResponse.error) {
            return null;
        }
        const { systemField } = dataResponse.data.data;
        return systemField;
    }
    private async getObjectField(objecttype: Type, fieldname = "", values = false) {
        if (!this.validateInputs({ objecttype })) {
            return null;
        }

        const url = fieldname === "" ? `${this.baseUrl}/metadata/records/${objecttype}/fields` : `${this.baseUrl}/metadata/records/${objecttype}/fields/${fieldname}/values`;

        const dataResponse = await this.sendRequest(url, "GET", { objecttype, fieldname, values });
        if (dataResponse.error) {
            return [];
        }
        const { data } = dataResponse.data || { data: [] };
        return values ? data?.values || [] : data;
    }
    private deleteObjectField(objecttype: Type, fieldname: string) {
        if (!this.validateInputs({ objecttype, fieldname })) {
            return null;
        }

        const url = `${this.baseUrl}/api/v2/system-field/${objecttype}/type/${fieldname}`;
        return this.sendRequest(url, "DELETE");
    }

    //Views
    private async createView(objecttype: Type, name: string) {
        if (!this.validateInputs({ objecttype, name })) {
            return null;
        }

        const url = `${this.baseUrl}/api/v2/views/${objecttype}`;
        const dataResponse = await this.sendRequest(url, "POST", { name });
        if (dataResponse.error) {
            return null;
        }
        return dataResponse.data;
    }
    private async getAllViews(objecttype: Type) {
        if (!this.validateInputs({ objecttype })) {
            return null;
        }
        const url = `${this.baseUrl}/api/v2/views/${objecttype}`;
        const dataResponse = await this.sendRequest(url, "GET");
        if (dataResponse.error) {
            return [];
        }
        const { views } = dataResponse.data || { Views: [] };
        return views;
    }
    private async getView(objecttype: Type, viewid: string) {
        if (!this.validateInputs({ objecttype, viewid })) {
            return null;
        }

        const url = `${this.baseUrl}/api/v2/views/${objecttype}/${viewid}`;
        const dataResponse = await this.sendRequest(url, "GET");
        if (dataResponse.error) {
            return null;
        }
        return dataResponse.data;
    }
    private async updateView(objecttype: Type, viewid: string, data: any) {
        if (!this.validateInputs({ objecttype, viewid, data })) {
            return null;
        }

        const url = `${this.baseUrl}/api/v2/views/${objecttype}/${viewid}`;
        const dataResponse = await this.sendRequest(url, "PUT", data);
        if (dataResponse.error) {
            return null;
        }
        return dataResponse.data;
    }
    private async deleteView(objecttype: Type, viewid: string) {
        if (!this.validateInputs({ objecttype, viewid })) {
            return null;
        }

        const url = `${this.baseUrl}/api/v2/views/${objecttype}/${viewid}`;
        return await this.sendRequest(url, "DELETE");
    }
    private async duplicateView(objecttype: Type, viewid: string) {
        if (!this.validateInputs({ objecttype, viewid })) {
            return null;
        }

        const url = `${this.baseUrl}/api/v2/views/${objecttype}/${viewid}/duplicate`;
        const dataResponse = await this.sendRequest(url, "POST", {});
        if (dataResponse.error) {
            return null;
        }
        return dataResponse.data;
    }
    private async setFavoriteView(objecttype: Type, viewid: string) {
        if (!this.validateInputs({ objecttype, viewid })) {
            return null;
        }

        const url = `${this.baseUrl}/api/v2/views/${objecttype}/${viewid}/setfavorite`;
        const dataResponse = await this.sendRequest(url, "POST", {});
        if (dataResponse.error) {
            return null;
        }
        return dataResponse.data;
    }
    private async removeFavoriteView(objecttype: Type, viewid: string) {
        if (!this.validateInputs({ objecttype, viewid })) {
            return null;
        }

        const url = `${this.baseUrl}/api/v2/views/${objecttype}/${viewid}/removefavorite`;
        const dataResponse = await this.sendRequest(url, "POST", {});
        if (dataResponse.error) {
            return null;
        }
        return dataResponse.data;
    }

    objects() {
        const resultPromise = this.getAllObjects();
        return {
            then: resultPromise.then.bind(resultPromise),
            create: async (name: string, collectionname: string) => this.createObjectType(name, collectionname),
            update: async (objecttype: Type, newData: any) => this.updateObjectType(objecttype, newData),
            delete: async (objecttype: Type) => this.deleteObjectType(objecttype),
        };
    }
    object(objecttype: Type) {
        return {
            create: async (data: any) => this.createObject(objecttype, data),
            getAll: async () => this.getObjectData(objecttype),
            get: async (objectid: string) => this.getById(objecttype, objectid),
            update: async (objectid: string, newData: any) => this.updateObject(objecttype, objectid, newData),
            delete: async (objectid: string) => this.deleteObject(objecttype, objectid),
            query: async (query = "", page_number = 1, page_size = 500, sort_type = "desc", sort_by = "createdon") => this.getObjectData(objecttype, query, page_number, page_size, sort_type, sort_by),
            queryOne: async (query = "", sort_type = "desc", sort_by = "createdon") => this.getFirst(objecttype, query, sort_type, sort_by),
            fields: () => {
                const resultPromise = this.getObjectField(objecttype);
                return {
                    then: resultPromise.then.bind(resultPromise),
                    create: async (fieldType: string, data: any) => this.createField(objecttype, fieldType, data),
                };
            },
            field: (fieldname: string) => {
                return {
                    get: async () => this.getObjectField(objecttype, fieldname),
                    update: async () => this.updateField(objecttype, fieldname, {}),
                    delete: async () => this.deleteObjectField(objecttype, fieldname),
                    values: async () => this.getObjectField(objecttype, fieldname, true),
                };
            },
            views: () => {
                const resultPromise = this.getAllViews(objecttype);
                return {
                    then: resultPromise.then.bind(resultPromise),
                    create: async (name: string) => this.createView(objecttype, name),
                };
            },
            view: (viewid: string) => {
                return {
                    get: async () => this.getView(objecttype, viewid),
                    update: async (data: any) => this.updateView(objecttype, viewid, data),
                    delete: async () => this.deleteView(objecttype, viewid),
                    duplicate: async () => this.duplicateView(objecttype, viewid),
                    setFavorite: async () => this.setFavoriteView(objecttype, viewid),
                    removeFavorite: async () => this.removeFavoriteView(objecttype, viewid),
                };
            },
        };
    }
    //Next version
    // order(orderid: string) {
    //     return {
    //         create: async (name: string) => {},
    //         get: async () => {},
    //         update: async () => {},
    //         getItems: async () => {},
    //     };
    // }
}
