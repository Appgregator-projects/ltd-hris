import axios from "axios";
const endpoint = import.meta.env.VITE_BASEURL;

//** AUTH
const userProfile = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData"))
  : null;
// console.log(
//   userProfile !== null ? userProfile.access_token : "NULL",
//   "API HEADER"
// );
if (userProfile !== null) {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${userProfile.access_token}`;
}
//** AUTH

export const serviceGetPipeline = async () => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/pipelines`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceDataSource = async () => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/externaldata`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAddNewDeals = async (card) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/crm/deal/create`,
    headers: {
      "Content-Type": "application/json",
    },
    data: card,
  };

  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceDetailDeal = async (card) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/deal/${parseInt(card)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceUpdateDeals = async (data) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/api/v1/crm/deal/update/default/${parseInt(
      data.formId.id
    )}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: { value: data.obj, label: data.formId.label },
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error;
  }
};
export const serviceUpdateTaskDeals = async (data) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/api/v1/crm/task/update/default/${parseInt(
      data.formId.id
    )}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: { value: data.obj, label: data.formId.label },
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error;
  }
};
export const serviceUpdateTaskDealsAdd = async (data) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/api/v1/crm/task/update/additional/${parseInt(
      data.formId
    )}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data.obj,
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error;
  }
};
export const serviceUpdateDealsAdd = async (data) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/api/v1/crm/deal/update/additional/${parseInt(
      data.formId
    )}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data.obj,
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const serviceDetailDataSource = async (data) => {
  let dataContact = null;
  let output = null;

  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/externaldata/${data}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);

    let dataArray = { data: { data: [] } };

    //hardcode ID >diatas 26
    const number = parseInt(response["data"]["id"]);

    if (number <= 26) {
      switch (response["data"]["key"]) {
        case "employee":
          // code block
          dataContact = await serviceEmployeeOnlyFormSelectBox();
          output = dataContact.map((s) => ({
            value: s.id,
            label: `${s.name}`,
          }));
          dataArray["data"]["data"].push(...output);
          return dataArray.data;

          break;

        case "vendor":
          // code block
          dataContact = await serviceContactFormSelectBox(
            response["data"]["key"]
          );
          output = dataContact.map((s) => ({
            value: s.id,
            label: `${s.firstName}`,
          }));
          dataArray["data"]["data"].push(...output);
          return dataArray.data;

          break;

        case "customer":
          dataContact = await serviceContactFormSelectBox(
            response["data"]["key"]
          );
          output = dataContact.map((s) => ({
            value: s.id,
            label: `${s.firstName}`,
          }));
          dataArray["data"]["data"].push(...output);
          return dataArray.data;

          break;

        case "companies":
          dataContact = await serviceContactFormSelectBox(
            response["data"]["key"]
          );

          output = dataContact.map((s) => ({
            value: s.id,
            label: `${s.firstName}`,
          }));
          dataArray["data"]["data"].push(...output);
          return dataArray.data;

          break;

        case "Manager":
          dataContact = await serviceContactFormSelectBox(
            response["data"]["key"]
          );
          output = dataContact.map((s) => ({
            value: s.id,
            label: `${s.firstName}`,
          }));
          dataArray["data"]["data"].push(...output);
          return dataArray.data;

          break;
        case "Branch":
          dataContact = await serviceBranchFormSelectBox(
            response["data"]["key"]
          );

          output = dataContact.map((s) => ({
            value: s.id,
            label: `${s.name}`,
          }));
          dataArray["data"]["data"].push(...output);
          return dataArray.data;

          break;
        default:
          return response.data;

        // code block
      }
    } else {
      let arrList = [];
      dataContact = await serviceLineManager(response["data"]["data"][0]["id"]);
      arrList.push(dataContact["manager"]);

      output = arrList.map((s) => ({
        value: s.id,
        label: `${s.name}`,
      }));

      dataArray["data"]["data"].push(...output);
      return dataArray.data;

      console.log(number, "EMPLOYEE LINE MANAGER");
    }
  } catch (error) {
    return error.response;
  }
};

export const serviceExternalDataSource = async (data) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/externaldata`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const servicePipelinesLists = async () => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/pipelines`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceKanbanByPipelineId = async (data) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/kanban/pipeline/${data}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const servicePipelinesFormLists = async (page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/pipelines/lists/form?page=${page}&limit=5`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const servicePipelinesDefForm = async () => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/pipelines/default/form`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const servicePipelinesFormById = async (data) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/pipelines/form/${data}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const servicePipelineStageById = async (data) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/pipelines/${data}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceCreatePipeline = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/crm/pipelines`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceCustomFields = async (data) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/custom-fields`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAddNewCustomFields = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/crm/custom-fields`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAddNewCustomTaskFields = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/crm/custom-fields-tasks`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAddDataSource = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/crm/externaldata`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceContact = async (params) => {
  let queryString = Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/contact/view?${queryString}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceContactFormSelectBox = async (type) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/contact/type/${type}?page=0&limit=10000`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data.rows;
  } catch (error) {
    return error.response;
  }
};

export const serviceEmployeeOnlyFormSelectBox = async () => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/contact/employee/list`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceCompany = async () => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/company`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data.rows;
  } catch (error) {
    return error.response;
  }
};

export const serviceDetailContact = async (id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/contact/${id}/view`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAddNewContact = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/crm/contact/create`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurate = async () => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/setting`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateUpdateToken = async (id, data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/accurate/setting/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateNewSession = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/accurate/create/session`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateScopes = async () => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/scopes`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateSaveSession = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/accurate/create/connection`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceStageBalance = async (pipeline_id, stage_id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/stage/balance/${pipeline_id}/${stage_id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const servicePipelineBalance = async (pipeline_id, stage_id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/stage/balance/${pipeline_id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceTasksLists = async (id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/lists/task/default?page=${id}&limit=5`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceTasksWithDealId = async (page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/tasks?page=${parseInt(page)}&limit=${parseInt(
      limit
    )}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceNotesLists = async (id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/lists/note/default?page=${id}&limit=5`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const servicePurchaseRequisitionLists = async (page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/list/purchase-requisition?page=${parseInt(
      page
    )}&limit=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const servicePurchaseInvoicesLists = async (page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/list/purchase-invoice?page=${parseInt(
      page
    )}&limit=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const getDetailPurchaseInvoicebyDealID = async (id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/deal/transaction/purchase-invoice/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const getDetailPurchaseReqByDealId = async (id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/deal/transaction/purchase-requisition/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const servicePurchasePaymentsLists = async (page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/list/purchase-payment?page=${parseInt(
      page
    )}&limit=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceJournalVouhersLists = async (page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/list/journal-voucher?page=${parseInt(
      page
    )}&limit=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceOtherPaymentLists = async (page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/list/other-payment?page=${parseInt(
      page
    )}&limit=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateDepartements = async (data, page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/master-data/departement/${data}?sp.page=${parseInt(
      page
    )}&sp.pageSize=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateDepartementsWithKeywords = async (
  data,
  page,
  limit,
  keywords
) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/master-data/departement/${data}?sp.page=${parseInt(
      page
    )}&sp.pageSize=${parseInt(limit)}&keywords=${
      keywords === undefined ? "" : keywords
    }`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateVendors = async (data, page, limit, keywords) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/master-data/vendor/${data}?sp.page=${parseInt(
      page
    )}&sp.pageSize=${parseInt(limit)}&keywords=${
      keywords === undefined ? "" : keywords
    }`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceAccurateContact = async (page, keywords) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/contact/view?page=${page}&limit=20`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceAccurateEmployeeHris = async () => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/hris/employee`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateProjects = async (data, page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/master-data/project/${data}?sp.page=${parseInt(
      page
    )}&sp.pageSize=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateProjectsWithKeywords = async (
  data,
  page,
  limit,
  keywords
) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/master-data/project/${data}?sp.page=${parseInt(
      page
    )}&sp.pageSize=${parseInt(limit)}&keywords=${
      keywords === undefined ? "" : keywords
    }`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateItems = async (data, page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/item/${data}?fields=id,no,name,itemType&sp.page=${parseInt(
      page
    )}&sp.pageSize=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateItemSearch = async (
  data,
  page,
  limit,
  keywords
) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/item/search/${data}?fields=id,no,name,itemType&sp.page=${parseInt(
      page
    )}&sp.pageSize=${parseInt(limit)}&keywords=${keywords}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateCOA = async (data, page, limit, keywords) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/master-data/coa/${data}?sp.page=${parseInt(
      page
    )}&sp.pageSize=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateCOAKeyword = async (
  data,
  page,
  limit,
  keywords
) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/master-data/coa/${data}?sp.page=${parseInt(
      page
    )}&sp.pageSize=${parseInt(limit)}&keywords=${keywords}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateBranchs = async (data, page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/master-data/branch/${data}?sp.page=${parseInt(
      page
    )}&sp.pageSize=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccuratePurchaseRequisition = async (companyId, data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/accurate/transaction/purchase-requisition/${companyId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const serviceAccuratePurchaseInvoice = async (companyId, data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/accurate/transaction/purchase-invoice/${companyId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccuratePurchaseInvoiceById = async (companyId, id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/purchase-invoice/${companyId}/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccuratePurchaseRequisitionById = async (companyId, id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/purchase-requisition/${parseInt(
      companyId
    )}/${parseInt(id)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceDefaultTaskProperties = async (companyId, data) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/custom-fields-def-tasks`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceDefaultNoteProperties = async (companyId, data) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/custom-fields-def-notes`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAdditionalTaskProperties = async (page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/custom-fields-tasks?page=${parseInt(
      page
    )}&limit=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAdditionalTaskPropertiesWithoutPagination = async (
  page,
  limit
) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/custom-fields-tasks-form`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAddNewTask = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/crm/task/create`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceViewTaskByDealId = async (data) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/task/${parseInt(data)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceViewNoteByDealId = async (data) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/note/${parseInt(data)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceViewGanttboard = async (data) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/taskgroup/lists`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceDeleteDealById = async (cardId) => {
  const configurationObject = {
    method: "DELETE",
    url: `${endpoint}/api/v1/crm/deal/${cardId}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceDataSourceList = async (data) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/externaldata/users/${data}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAdditionalNoteProperties = async (page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/custom-fields-notes?page=${parseInt(
      page
    )}&limit=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAddNewNote = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/crm/note/create`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAddNewMediaFiles = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/crm/media-files/upload`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const serviceListMediaFiles = async (data, page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/media-files/deal/${parseInt(
      data
    )}?page=${parseInt(page)}&limit=${100}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceMediaFileTaskList = async (id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/automation/stage/rules/${parseInt(id)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateOutstandingInvoiceByVendorId = async (
  companyId,
  page,
  limit,
  vendorId
) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/vendor/list/purchase-invoice/${parseInt(
      companyId
    )}?page=${parseInt(page)}&limit=${parseInt(limit)}&vendorId=${vendorId}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateCOAKeywordFilterCashBank = async (
  data,
  page,
  limit,
  keywords
) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/master-data/coa/${data}?sp.page=${parseInt(
      page
    )}&sp.pageSize=${parseInt(
      limit
    )}&keywords=${keywords}&filter.accountType=CASH_BANK&fields`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceRoles = async () => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/auth/role-and-permissions/roles-list`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const servicePermissions = async () => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/auth/role-and-permissions/module`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccuratePurchasePayment = async (companyId, data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/accurate/transaction/purchase-payment/${companyId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceAccurateOtherPayment = async (companyId, data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/accurate/transaction/other-payment/${companyId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const serviceAccurateJournalPayment = async (companyId, data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/accurate/transaction/journal-voucher/${companyId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response;
  } catch (error) {
    return error;
  }
};

export const servicePurchaseRequisitionListsById = async (id, page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/list/purchase-requisition/${parseInt(
      id
    )}?page=${parseInt(page)}&limit=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const servicePurchaseInvoiceListsById = async (id, page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/list/purchase-invoice/${parseInt(
      id
    )}?page=${parseInt(page)}&limit=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceQuotationDesignLists = async (id, page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/quotation-design/deals/${id}?page=${page}&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceQuotationDesignPreview = async (id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/quotation-design/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceItemDesignLists = async () => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/master-data/work-items?page=0`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceCreateQuotationDesign = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/crm/quotation-design/create`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(configurationObject);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getDetailPurchaseReqById = async (id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/list/purchase-requisition/detail/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getDetailPurchaseInvById = async (id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/list/purchase-invoice/detail/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceUpdateTaskDealsDefaultR1 = async (id, data) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/api/v1/crm/task/update/default/${parseInt(id)}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const serviceUpdateNoteDealsDefaultR1 = async (id, data) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/api/v1/crm/note/update/default/${parseInt(id)}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const serviceUpdateTaskDealsAddR1 = async (id, data) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/api/v1/crm/task/update/additional/${parseInt(id)}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error;
  }
};
export const serviceUpdateNoteDealsAddR1 = async (id, data) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/api/v1/crm/note/update/additional/${parseInt(id)}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const serviceUpdateDealsDefR1 = async (id, data) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/api/v1/crm/deal/update/default/${parseInt(id)}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const serviceUpdateDealsAddR1 = async (id, data) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/api/v1/crm/deal/update/additional/${parseInt(id)}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const serviceBranchFormSelectBox = async (type) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/hris/branch`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceStageById = async (data) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/stage/${data}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAccurateDraftPurchaseInvoice = async (companyId, data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/accurate/transaction/draft/purchase-invoice/${companyId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const servicePurchaseInvoicesListsByFilter = async (
  filter,
  page,
  limit
) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/list/purchase-invoice/filter?status=${filter}&page=${parseInt(
      page
    )}&limit=${parseInt(limit)}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceUpdateDraftInvoices = async (id, data) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/api/v1/accurate/transaction/draft/purchase-invoice/${parseInt(
      id
    )}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const serviceDraftInvoicesPushToAccurate = async (id, data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/accurate/transaction/purchase-invoice/push-to-accurate/${parseInt(
      id
    )}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);

    return response;
  } catch (error) {
    return error.response;
  }
};

export const serviceLineManager = async (id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/hris/division/${parseInt(id)}/head`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceAddNewRoles = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/auth/role-and-permissions/role`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const serviceUpdateRolesById = async (id, data) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/auth/role-and-permissions/role/${parseInt(id)}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const serviceAutomationRulesAdd = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/crm/automation/stage/rules`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const serviceAutomationRulesUpdate = async (data, id) => {
  const configurationObject = {
    method: "PUT",
    url: `${endpoint}/api/v1/crm/automation/stage/rules/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const response = await axios(configurationObject);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const serviceAutomationList = async (page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/automation/stage/rules/?page=${
      page - 1
    }&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceAutomationListById = async (page, limit, Stageid) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/automation/stage/rules/${Stageid}?page=${
      page - 1
    }&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceAutomationDelete = async (id) => {
  const configurationObject = {
    method: "DELETE",
    url: `${endpoint}/api/v1/crm/automation/stage/rules/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const serviceGetProgressTask = async (stageId, dealsId) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/automation/stage/rules/progress/${stageId}/${dealsId}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(configurationObject);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const Me = async (accessToken) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/auth/profile`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios(configurationObject);

    return response;
  } catch (error) {
    return error.response;
  }
};

export const serviceGetLoanList = async (page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/employee/loan?page=${page}&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceGetLoanListById = async (id) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/employee/loan/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};
export const serviceGetLoanListByStatus = async (page, limit, status) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/accurate/transaction/employee/loan/status?page=${page}&limit=${limit}&status=${status}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);

    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const serviceCreateLoan = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/accurate/transaction/employee/loan`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(configurationObject);

    return response;
  } catch (error) {
    return error.response;
  }
};
export const serviceDeleteLoan = async (id) => {
  const configurationObject = {
    method: "DELETE",
    url: `${endpoint}/api/v1/accurate/transaction/employee/loan/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);

    return response;
  } catch (error) {
    return error.response;
  }
};

export const serviceWorkItemList = async (page, limit) => {
  const configurationObject = {
    method: "GET",
    url: `${endpoint}/api/v1/crm/master-data/work-items?page=${page}&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);

    return response;
  } catch (error) {
    return error.response;
  }
};

export const serviceWorkItemDelete = async (id) => {
  const configurationObject = {
    method: "DELETE",
    url: `${endpoint}/api/v1/crm/master-data/work-items/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios(configurationObject);

    return response;
  } catch (error) {
    return error.response;
  }
};
export const serviceWorkItemCreate = async (data) => {
  const configurationObject = {
    method: "POST",
    url: `${endpoint}/api/v1/crm/master-data/work-items/create`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(configurationObject);

    return response;
  } catch (error) {
    return error.response;
  }
};
