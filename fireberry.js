var Type;
(function (Type) {
    Type[(Type["CUSTOMER"] = 1)] = "CUSTOMER";
    Type[(Type["CONTACT"] = 2)] = "CONTACT";
})(Type || (Type = {}));

class Fireberry {
    constructor(apiToken) {
        this.apiToken = apiToken;
    }

    async sendRequest(data = {}, reqType = "query") {
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
            let options = {
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

    async getData(objecttype, query = "", page_number = 1, page_size = 500, sort_type = "desc", sort_by = "createdon", accumulator = []) {
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

    async getById(objecttype, objectid) {
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

    async getFirst(objecttype, query = "", sort_type = "desc", sort_by = "createdon") {
        const data = await this.getData(objecttype, query, 1, 1, sort_type, sort_by);
        return data[0] || null;
    }

    object(objecttype) {
        return {
            create: async (data) => this.sendRequest({ ...data, objecttype }, "create"),
            getById: async (objectid) => this.getById(objecttype, objectid),
            query: async (query = "", page_number = 1, page_size = 500, sort_type = "desc", sort_by = "createdon") => this.getData(objecttype, query, page_number, page_size, sort_type, sort_by),
            queryOne: async (query = "", sort_type = "desc", sort_by = "createdon") => this.getFirst(objecttype, query, sort_type, sort_by),
            getAll: async (query) => this.getData(objecttype),
            update: async (objectid, newData) => this.sendRequest({ ...newData, objectid, objecttype }, "update"),
            delete: async (objectid) => this.sendRequest({ objectid, objecttype }, "delete"),
        };
    }
}
