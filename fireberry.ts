const enum Type {
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
    CUSTOMOBJECT1000 = 1000,
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
type ReqType = "create" | "update" | "delete" | "get" | "query";

class Fireberry {
    private apiToken?: string;

    constructor(apiToken?: string) {
        this.apiToken = apiToken;
    }

    private async sendRequest(data: any = {}, reqType: ReqType = "query"): Promise<{ data?: any; error?: boolean }> {
        try {
            const baseUrl = this.apiToken ? "https://app.fireberry.com/api" : "/api";
            let url = "",
                method = "POST";
            switch (reqType) {
                case "create":
                    url = `${baseUrl}/record/${data.objecttype}`;
                    break;
                case "update":
                    method = "PUT";
                    url = `${baseUrl}/record/${data.objecttype}/${data.objectid}`;
                    break;
                case "delete":
                    method = "DELETE";
                    url = `${baseUrl}/record/${data.objecttype}/${data.objectid}`;
                    break;
                case "get":
                    method = "GET";
                    url = `${baseUrl}/record/${data.objecttype}/${data.objectid}`;
                    break;
                default:
                    url = `${baseUrl}/query`;
                    break;
            }
            const headers = {
                "Content-Type": "application/json",
            };

            // Add tokenid header if apiToken is present
            if (this.apiToken) {
                headers["tokenid"] = this.apiToken;
            }
            const { objecttype, objectid, ...rest } = data;
            let options: any = {
                method,
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: headers,
                redirect: "follow",
                referrerPolicy: "no-referrer",
            };

            if (reqType !== "get") {
                options.body = JSON.stringify(reqType === "query" ? data : { ...rest });
            }

            const response = await fetch(url, options);

            return { data: await response.json() };
        } catch (error) {
            console.error(error);
            return { error: true };
        }
    }

    private async getData(objecttype: Type, query = "", page_number = 1, page_size = 500, sort_type = "desc", sort_by = "createdon", accumulator: any[] = []) {
        const dataResponse = await this.sendRequest({
            fields: "",
            objecttype,
            query,
            page_size,
            page_number,
            sort_by,
            sort_type,
        });
        if (dataResponse.data.error) {
            return [];
        }
        const { Data } = dataResponse.data.data || { Data: [] };

        if (Data.length === page_size) {
            return this.getData(objecttype, query, page_number + 1, page_size, sort_type, sort_by, [...accumulator, ...Data]);
        } else {
            return [...accumulator, ...Data];
        }
    }

    private async getById(objecttype: Type, objectid: string) {
        const dataResponse = await this.sendRequest(
            {
                objecttype,
                objectid,
            },
            "get"
        );
        if (!dataResponse || dataResponse.data?.error) {
            return null;
        }
        const { Record } = dataResponse.data.data;
        return Record;
    }

    private async getFirst(objecttype: Type, query = "", sort_type = "desc", sort_by = "createdon") {
        const data = await this.getData(objecttype, query, 1, 1, sort_type, sort_by);
        return data[0] || null;
    }

    object(objecttype: Type) {
        return {
            create: async (data: any) => this.sendRequest({ ...data, objecttype }, "create"),
            getById: async (objectid: string) => this.getById(objecttype, objectid),
            query: async (query = "", page_number = 1, page_size = 500, sort_type = "desc", sort_by = "createdon") => this.getData(objecttype, query, page_number, page_size, sort_type, sort_by),
            queryOne: async (query = "", sort_type = "desc", sort_by = "createdon") => this.getFirst(objecttype, query, sort_type, sort_by),
            getAll: async (query: string) => this.getData(objecttype),
            update: async (objectid: string, newData: any) => this.sendRequest({ ...newData, objectid, objecttype }, "update"),
            delete: async (objectid: string) => this.sendRequest({ objectid, objecttype }, "delete"),
        };
    }
}
