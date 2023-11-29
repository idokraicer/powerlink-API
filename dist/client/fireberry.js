"use strict";
let Type;
(function (Type) {
    Type[(Type["ACCOUNT"] = 1)] = "ACCOUNT";
    Type[(Type["CONTACT"] = 2)] = "CONTACT";
    Type[(Type["INVOICEITEM"] = 79)] = "INVOICEITEM";
    Type[(Type["FACEBOOKCONNECTION"] = 107)] = "FACEBOOKCONNECTION";
    Type[(Type["PROVIDERVERIFICATION"] = 111)] = "PROVIDERVERIFICATION";
    Type[(Type["UI"] = 112)] = "UI";
    Type[(Type["AUDITLOG"] = 109)] = "AUDITLOG";
    Type[(Type["RECORDLAYOUT"] = 108)] = "RECORDLAYOUT";
    Type[(Type["WFRULE"] = 55)] = "WFRULE";
    Type[(Type["CRMORDER"] = 13)] = "CRMORDER";
    Type[(Type["CONTRACT"] = 28)] = "CONTRACT";
    Type[(Type["INVOICECREDIT"] = 85)] = "INVOICECREDIT";
    Type[(Type["INVOICENO"] = 81)] = "INVOICENO";
    Type[(Type["INVOICERENO"] = 84)] = "INVOICERENO";
    Type[(Type["INVOICEDRAFT"] = 82)] = "INVOICEDRAFT";
    Type[(Type["ACTIVITYLOG"] = 102)] = "ACTIVITYLOG";
    Type[(Type["DASHBOARD"] = 92)] = "DASHBOARD";
    Type[(Type["ARTICLE"] = 76)] = "ARTICLE";
    Type[(Type["PRODUCT"] = 14)] = "PRODUCT";
    Type[(Type["OPPORTUNITY"] = 4)] = "OPPORTUNITY";
    Type[(Type["CALENDARRESOURCE"] = 114)] = "CALENDARRESOURCE";
    Type[(Type["TASK"] = 10)] = "TASK";
    Type[(Type["COMPETITOR"] = 8)] = "COMPETITOR";
    Type[(Type["ACTIVITY"] = 6)] = "ACTIVITY";
    Type[(Type["PROJECT"] = 46)] = "PROJECT";
    Type[(Type["INVOICERECEIPTITEM"] = 80)] = "INVOICERECEIPTITEM";
    Type[(Type["TRANSACTIONITEM"] = 90)] = "TRANSACTIONITEM";
    Type[(Type["INVOICERECEIPT"] = 83)] = "INVOICERECEIPT";
    Type[(Type["CAMPAIGN"] = 67)] = "CAMPAIGN";
    Type[(Type["CASES"] = 5)] = "CASES";
    Type[(Type["ACCOUNTPRODUCT"] = 33)] = "ACCOUNTPRODUCT";
    Type[(Type["CALLLOG"] = 100)] = "CALLLOG";
    Type[(Type["ATTENDANCECLOCK"] = 101)] = "ATTENDANCECLOCK";
    Type[(Type["INVOICE"] = 78)] = "INVOICE";
    Type[(Type["INVOICEDELIVERY"] = 86)] = "INVOICEDELIVERY";
    Type[(Type["CONVERSATION"] = 104)] = "CONVERSATION";
    Type[(Type["WIDGET"] = 75)] = "WIDGET";
    Type[(Type["EMAILMESSAGE"] = 103)] = "EMAILMESSAGE";
    Type[(Type["NOTE"] = 7)] = "NOTE";
    Type[(Type["IPRESTRICTION"] = 89)] = "IPRESTRICTION";
    Type[(Type["ROLE"] = 64)] = "ROLE";
    Type[(Type["BUSINESSUNIT"] = 23)] = "BUSINESSUNIT";
    Type[(Type["LINK"] = 77)] = "LINK";
    Type[(Type["CRMUSERLOGIN"] = 70)] = "CRMUSERLOGIN";
    Type[(Type["DOC"] = 11)] = "DOC";
    Type[(Type["CRMUSER"] = 9)] = "CRMUSER";
    Type[(Type["CRMORDERITEM"] = 17)] = "CRMORDERITEM";
    Type[(Type["ORG"] = 25)] = "ORG";
    Type[(Type["MDOBJECT"] = 58)] = "MDOBJECT";
    Type[(Type["SYSTEMFIELD"] = 73)] = "SYSTEMFIELD";
    Type[(Type["SMSTEMPLATE"] = 110)] = "SMSTEMPLATE";
    Type[(Type["PRINTTEMPLATE"] = 27)] = "PRINTTEMPLATE";
    Type[(Type["TEXTTEMPLATE"] = 106)] = "TEXTTEMPLATE";
    Type[(Type["TEAMINBOX"] = 105)] = "TEAMINBOX";
    Type[(Type["VIEWDESIGNER"] = 30)] = "VIEWDESIGNER";
})(Type || (Type = {}));

class Fireberry {
    constructor(apiToken) {
        this.apiToken = apiToken;
        this.baseUrl = apiToken ? "https://api.fireberry.com" : "";
    }

    //Utils
    async sendRequest(url, method, data = {}) {
        try {
            const headers = {
                "Content-Type": "application/json",
            };

            // Add tokenid header if apiToken is exists
            if (this.apiToken) {
                headers["tokenid"] = this.apiToken;
            }

            let options = {
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
    validateInputs(args) {
        for (let key in args) {
            if (!args[key]) {
                console.error(`${key} is required`);
                return false;
            }
        }
        return true;
    }

    //ObjectTypes
    async createObjectType(name, collectionname) {
        if (!this.validateInputs({ name, collectionname })) {
            return null;
        }

        const url = `${this.baseUrl}/api/v2/record/58`;
        const dataResponse = await this.sendRequest(url, "POST", {
            name,
            collectionname,
        });
        if (dataResponse.error) {
            return null;
        }
        const { record } = dataResponse.data;
        return record;
    }
    async updateObjectType(objecttype, data) {
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
    async deleteObjectType(objecttype) {
        if (!this.validateInputs({ objecttype })) {
            return null;
        }

        const url = `${this.baseUrl}/api/record/58/${objecttype}`;
        return await this.sendRequest(url, "DELETE");
    }
    //Objects
    async createObject(objecttype, data) {
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
    async getAllObjects() {
        const url = `${this.baseUrl}/metadata/records`;
        const dataResponse = await this.sendRequest(url, "GET");
        if (dataResponse.error) {
            return [];
        }
        const { data } = dataResponse.data || { data: [] };
        return data;
    }
    async updateObject(objecttype, objectid, data) {
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
    async deleteObject(objecttype, objectid) {
        if (!this.validateInputs({ objecttype, objectid })) {
            return null;
        }

        const url = `${this.baseUrl}/api/record/${objecttype}/${objectid}`;
        return await this.sendRequest(url, "DELETE");
    }
    async getObjectData(objecttype, query = "", page_number = 1, page_size = 500, sort_type = "desc", sort_by = "createdon", accumulator = []) {
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
    async getFirst(objecttype, query = "", sort_type = "desc", sort_by = "createdon") {
        if (!this.validateInputs({ objecttype })) {
            return null;
        }

        const data = await this.getObjectData(objecttype, query, 1, 1, sort_type, sort_by);
        return data[0] || null;
    }
    async getById(objecttype, objectid) {
        if (!this.validateInputs({ objecttype, objectid })) {
            return null;
        }

        const url = `${this.baseUrl}/api/record/${objecttype}/${objectid}`;
        const dataResponse = await this.sendRequest(url, "GET", {
            objecttype,
            objectid,
        });
        if (!dataResponse || dataResponse.error) {
            return null;
        }
        const { Record } = dataResponse.data.data;
        return Record;
    }

    //Fields
    async createField(objecttype, fieldType, data) {
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
    async updateField(objecttype, fieldid, data) {
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
    async getObjectField(objecttype, fieldname = "", values = false) {
        if (!this.validateInputs({ objecttype })) {
            return null;
        }

        const url = fieldname === "" ? `${this.baseUrl}/metadata/records/${objecttype}/fields` : `${this.baseUrl}/metadata/records/${objecttype}/fields/${fieldname}/values`;

        const dataResponse = await this.sendRequest(url, "GET", {
            objecttype,
            fieldname,
            values,
        });
        if (dataResponse.error) {
            return [];
        }
        const { data } = dataResponse.data || { data: [] };
        return values ? data?.values || [] : data;
    }
    deleteObjectField(objecttype, fieldname) {
        if (!this.validateInputs({ objecttype, fieldname })) {
            return null;
        }

        const url = `${this.baseUrl}/api/v2/system-field/${objecttype}/type/${fieldname}`;
        return this.sendRequest(url, "DELETE");
    }

    //Views
    async createView(objecttype, name) {
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
    async getAllViews(objecttype) {
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
    async getView(objecttype, viewid) {
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
    async updateView(objecttype, viewid, data) {
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
    async deleteView(objecttype, viewid) {
        if (!this.validateInputs({ objecttype, viewid })) {
            return null;
        }

        const url = `${this.baseUrl}/api/v2/views/${objecttype}/${viewid}`;
        return await this.sendRequest(url, "DELETE");
    }
    async duplicateView(objecttype, viewid) {
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
    async setFavoriteView(objecttype, viewid) {
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
    async removeFavoriteView(objecttype, viewid) {
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
            create: async (name, collectionname) => this.createObjectType(name, collectionname),
            update: async (objecttype, newData) => this.updateObjectType(objecttype, newData),
            delete: async (objecttype) => this.deleteObjectType(objecttype),
        };
    }
    object(objecttype) {
        return {
            create: async (data) => this.createObject(objecttype, data),
            getAll: async () => this.getObjectData(objecttype),
            get: async (objectid) => this.getById(objecttype, objectid),
            update: async (objectid, newData) => this.updateObject(objecttype, objectid, newData),
            delete: async (objectid) => this.deleteObject(objecttype, objectid),
            query: async (query = "", page_number = 1, page_size = 500, sort_type = "desc", sort_by = "createdon") => this.getObjectData(objecttype, query, page_number, page_size, sort_type, sort_by),
            queryOne: async (query = "", sort_type = "desc", sort_by = "createdon") => this.getFirst(objecttype, query, sort_type, sort_by),
            fields: () => {
                const resultPromise = this.getObjectField(objecttype);
                return {
                    then: resultPromise.then.bind(resultPromise),
                    create: async (fieldType, data) => this.createField(objecttype, fieldType, data),
                };
            },
            field: (fieldname) => {
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
                    create: async (name) => this.createView(objecttype, name),
                };
            },
            view: (viewid) => {
                return {
                    get: async () => this.getView(objecttype, viewid),
                    update: async (data) => this.updateView(objecttype, viewid, data),
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
