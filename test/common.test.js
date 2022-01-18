const esCommon = require("../src/common/elasticsearch");
const client = require("../src/elastic/connection");
jest.mock("../src/elastic/connection");

const index = process.env.INDEX_NAME;
const type = process.env.TYPE_NAME;

const dataTest = {
  username: "username",
  password: "pass12345",
  email: "email01@gmail.com",
  status: 10,
};

const idTest = "1";

afterAll(async () => {
  jest.resetAllMocks();
});

describe("create new passed", () => {
  beforeEach(() => {
    client.index.mockReturnValue({
      status: 201,
      message: "created",
    });
  });
  test("should response a result success", async () => {
    const resp = await esCommon.createNew(index, type, dataTest);
    expect(resp.status).toBe(201);
    expect(resp.message).toEqual("created");
  });
});

describe("create new missing", () => {
  beforeEach(() => {
    client.index.mockImplementation(() => {
      throw new Error("something error");
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await esCommon.createNew(index, type, dataTest);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("create fail!");
  });
});

describe("get all passed", () => {
  beforeEach(() => {
    client.search.mockReturnValue({
      status: 200,
      message: "success",
    });
  });
  test("should response a result success", async () => {
    const resp = await esCommon.getAll(index, type);
    expect(resp.status).toBe(200);
    expect(resp.message).toEqual("success");
  });
});

describe("get all missing", () => {
  beforeEach(() => {
    client.search.mockImplementation(() => {
      throw new Error("something error");
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await esCommon.getAll(index, type);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("data not found!");
  });
});

describe("get one passed", () => {
  beforeEach(() => {
    client.get.mockReturnValue({
      status: 200,
      message: "success",
    });
  });
  test("should response a result success", async () => {
    const resp = await esCommon.getOne(index, type, idTest);
    expect(resp.status).toBe(200);
    expect(resp.message).toEqual("success");
  });
});

describe("get one missing", () => {
  beforeEach(() => {
    client.get.mockImplementation(() => {
      throw new Error("something error");
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await esCommon.getOne(index, type);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("data not found!");
  });
});

describe("update one passed", () => {
  beforeEach(() => {
    client.update.mockReturnValue({
      status: 200,
      message: "success",
    });
  });
  test("should response a result success", async () => {
    const resp = await esCommon.update(index, type, idTest, dataTest);
    expect(resp.status).toBe(200);
    expect(resp.message).toEqual("success");
  });
});

describe("update one missing", () => {
  beforeEach(() => {
    client.update.mockImplementation(() => {
      throw new Error("something error");
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await esCommon.update(index, type, idTest, dataTest);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("update fail!");
  });
});

describe("delete one passed", () => {
  beforeEach(() => {
    client.delete.mockReturnValue({
      status: 200,
      message: "success",
    });
  });
  test("should response a result success", async () => {
    const resp = await esCommon.deleteOne(index, type, idTest);
    expect(resp.status).toBe(200);
    expect(resp.message).toEqual("success");
  });
});

describe("delete one missing", () => {
  beforeEach(() => {
    client.delete.mockImplementation(() => {
      throw new Error("something error");
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await esCommon.deleteOne(index, type, idTest);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("delete fail!");
  });
});

describe("delete all passed", () => {
  beforeEach(() => {
    client.deleteByQuery.mockReturnValue({
      status: 200,
      message: "success",
    });
  });
  test("should response a result success", async () => {
    const resp = await esCommon.deleteAll(index, type);
    expect(resp.status).toBe(200);
    expect(resp.message).toEqual("success");
  });
});

describe("delete all missing", () => {
  beforeEach(() => {
    client.deleteByQuery.mockImplementation(() => {
      throw new Error("something error");
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await esCommon.deleteOne(index, type);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("delete fail!");
  });
});

describe("get by field name passed", () => {
  beforeEach(() => {
    client.search.mockReturnValue({
      body: {
        hits: {
          total: 1,
          hits: [
            {
              ...dataTest,
            },
          ],
        },
      },
    });
  });
  test("should response a result success", async () => {
    const resp = await esCommon.getByFieldName(index, type, dataTest);
    expect(resp).toHaveProperty("hits");
  });
});

describe("get by field name missing", () => {
  beforeEach(() => {
    client.search.mockImplementation(() => {
      throw new Error("something error");
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await esCommon.getByFieldName(index, type, dataTest);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("data not found!");
  });
});

describe("check duplicate true", () => {
  beforeEach(() => {
    client.search.mockReturnValue({
      body: {
        hits: {
          total: 1,
          hits: [
            {
              ...dataTest,
            },
          ],
        },
      },
    });
  });
  test("should response a result success", async () => {
    const resp = await esCommon.checkDuplicate(index, type, dataTest);
    expect(resp).toBe(true);
  });
});

describe("check duplicate false", () => {
  beforeEach(() => {
    client.search.mockReturnValue({
      body: {
        hits: {
          total: 0,
          hits: [],
        },
      },
    });
  });
  test("should response a result success", async () => {
    const resp = await esCommon.checkDuplicate(index, type, dataTest);
    expect(resp).toBe(false);
  });
});

describe("check duplicate missing", () => {
  beforeEach(() => {
    client.search.mockReturnValue(() => {
      throw new Error("something error");
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await esCommon.checkDuplicate(index, type, dataTest);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("check duplicate fail!");
  });
});

describe("search by id passed", () => {
  beforeEach(() => {
    client.search.mockReturnValue({
      body: {
        hits: {
          total: 1,
          hits: [
            {
              ...dataTest,
            },
          ],
        },
      },
    });
  });
  test("should response a result success", async () => {
    const resp = await esCommon.searchById(index, type, idTest);
    expect(resp).toHaveProperty("hits");
  });
});

describe("search by id missing", () => {
  beforeEach(() => {
    client.search.mockReturnValue(() => {
      throw new Error("something error");
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await esCommon.searchById(index, type, idTest);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("data not found!");
  });
});
