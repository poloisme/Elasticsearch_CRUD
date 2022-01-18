const userService = require("../src/services/user.service");
const esCommon = require("../src/common/elasticsearch");
const handleJWT = require("../src/utils/handleJWT");
const md5 = require("md5");
jest.mock("../src/elastic/connection");
jest.mock("../src/common/elasticsearch");
jest.mock("../src/utils/handleJWT");
// jest.setTimeout(30000);

const data = {
  username: "username",
  password: "pass12345",
  email: "email01@gmail.com",
  status: 10,
};

const id = "1";

afterAll(async () => {
  jest.resetAllMocks();
});

describe("when create with data missing", () => {
  beforeEach(() => {
    esCommon.checkDuplicate.mockReturnValue(true);
    esCommon.createNew.mockReturnValue({
      status: 201,
      message: "created",
      body: data,
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await userService.createNewUser(data);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("username already exist!");
  });
});

describe("when create with data passed", () => {
  beforeEach(() => {
    esCommon.checkDuplicate.mockReturnValue(false);
    esCommon.createNew.mockReturnValue({
      status: 201,
      message: "created",
      body: data,
    });
  });
  test("should response a status 201 and message success", async () => {
    const resp = await userService.createNewUser(data);
    expect(resp.status).toBe(201);
    expect(resp.message).toEqual("successfully");
  });
});

describe("when get all users passed", () => {
  beforeEach(() => {
    esCommon.getAll.mockReturnValue({
      status: 200,
      total: 1,
      body: {
        hits: {
          hits: [
            {
              ...data,
              password: md5(data.password),
            },
          ],
        },
      },
    });
  });
  test("should response a status 200 and list user", async () => {
    const resp = await userService.getAllUser();
    expect(resp.status).toBe(200);
    expect(resp.data[0]).toHaveProperty("username");
    expect(resp.data[0]).toHaveProperty("password");
    expect(resp.data[0]).toHaveProperty("email");
    expect(resp.data[0]).toHaveProperty("status");
  });
});

describe("when get all user missing", () => {
  beforeEach(() => {
    esCommon.getAll.mockReturnValue({
      status: 200,
      total: 0,
      body: {
        hits: {
          hits: [],
        },
      },
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await userService.getAllUser();
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("not found!");
  });
});

describe("when get a user passed", () => {
  beforeEach(() => {
    esCommon.searchById.mockReturnValue({
      status: 200,
      total: 1,
      hits: [
        {
          _source: {
            ...data,
            password: md5(data.password),
          },
        },
      ],
    });
  });
  test("should response a user and status 200", async () => {
    const resp = await userService.getOneUser(id);
    expect(resp.status).toBe(200);
    expect(resp.data).toHaveProperty("username");
    expect(resp.data).toHaveProperty("password");
    expect(resp.data).toHaveProperty("email");
    expect(resp.data).toHaveProperty("status");
    expect(resp.data).toHaveProperty("id");
  });
});

describe("when get a user missing", () => {
  beforeEach(() => {
    esCommon.searchById.mockReturnValue({
      status: 200,
      total: 0,
      hits: [],
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await userService.getOneUser(id);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("user not found!");
  });
});

describe("delete one user passed", () => {
  beforeEach(() => {
    esCommon.searchById.mockReturnValue({
      status: 200,
      total: 1,
      hits: [
        {
          _source: {
            ...data,
            password: md5(data.password),
          },
        },
      ],
    });
  });
  test("should response a status 200 and message success", async () => {
    const resp = await userService.deleteOneUser(id);
    expect(resp.status).toBe(200);
    expect(resp.message).toEqual("successfully");
  });
});

describe("delete one user missing", () => {
  beforeEach(() => {
    esCommon.searchById.mockReturnValue({
      status: 200,
      total: 0,
      hits: [],
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await userService.deleteOneUser(id);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("user not found!");
  });
});

describe("delete all user passed", () => {
  beforeEach(() => {
    esCommon.createNew.mockReturnValue({
      status: 201,
      message: "created",
      body: data,
    });
  });
  test("should response a status 200 and message success", async () => {
    const resp = await userService.deleteAllUser();
    expect(resp.status).toBe(200);
    expect(resp.message).toEqual("successfully");
  });
});

describe("update one user passed", () => {
  beforeEach(() => {
    esCommon.checkDuplicate.mockReturnValue(false);
    esCommon.createNew.mockReturnValue({
      status: 201,
      message: "created",
      body: data,
    });
    esCommon.searchById.mockReturnValue({
      status: 200,
      total: 1,
      hits: [
        {
          _source: {
            ...data,
            password: md5(data.password),
          },
        },
      ],
    });
  });
  test("should response a status 200 and message success", async () => {
    const resp = await userService.updateOneUser(id, data);
    expect(resp.status).toBe(200);
    expect(resp.message).toEqual("successfully");
  });
});

describe("update one user missing (user not found)", () => {
  beforeEach(() => {
    esCommon.checkDuplicate.mockReturnValue(false);
    esCommon.createNew.mockReturnValue({
      status: 201,
      message: "created",
      body: data,
    });
    esCommon.searchById.mockReturnValue({
      status: 200,
      total: 0,
      hits: [],
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await userService.updateOneUser(id, data);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("user not found!");
  });
});

describe("update one user missing (duplicate user)", () => {
  beforeEach(() => {
    esCommon.checkDuplicate.mockReturnValue(true);
    esCommon.createNew.mockReturnValue({
      status: 201,
      message: "created",
      body: data,
    });
    esCommon.searchById.mockReturnValue({
      status: 200,
      total: 1,
      hits: [
        {
          _source: {
            ...data,
            password: md5(data.password),
          },
        },
      ],
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await userService.updateOneUser(id, data);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("username already exist!");
  });
});

describe("sign up passed", () => {
  beforeEach(() => {
    esCommon.checkDuplicate.mockReturnValue(false);
    esCommon.createNew.mockReturnValue({
      body: {
        _id: id,
      },
    });
    esCommon.getOne.mockReturnValue({
      body: {
        _source: {
          ...data,
          password: md5(data.password),
        },
      },
    });
  });
  test("should response a token and refresh token", async () => {
    const resp = await userService.signup(data);
    expect(resp).toHaveProperty("token");
    expect(resp).toHaveProperty("refreshToken");
  });
});

describe("sign up missing", () => {
  beforeEach(() => {
    esCommon.checkDuplicate.mockReturnValue(true);
    esCommon.createNew.mockReturnValue({
      body: {
        _id: id,
      },
    });
    esCommon.getOne.mockReturnValue({
      body: {
        _source: {
          ...data,
          password: md5(data.password),
        },
      },
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await userService.signup(data);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("username already exist!");
  });
});

describe("login passed", () => {
  beforeEach(() => {
    esCommon.getByFieldName.mockReturnValue({
      status: 200,
      total: 1,
      hits: [
        {
          _source: {
            ...data,
            password: md5(data.password),
          },
        },
      ],
    });
  });
  test("should response a token and refresh token", async () => {
    let account = { username: "username", password: "pass12345" };
    const resp = await userService.login(account);
    expect(resp).toHaveProperty("token");
    expect(resp).toHaveProperty("refreshToken");
  });
});

describe("login missing (username invalid)", () => {
  beforeEach(() => {
    esCommon.getByFieldName.mockReturnValue({
      status: 200,
      total: 0,
      hits: [],
    });
  });
  test("should response a error", async () => {
    let account = { username: "user", password: "pass12345" };
    let error;
    try {
      await userService.login(account);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("invalid username!");
  });
});

describe("login missing (password invalid)", () => {
  beforeEach(() => {
    esCommon.getByFieldName.mockReturnValue({
      status: 200,
      total: 1,
      hits: [
        {
          _source: {
            ...data,
            password: md5(data.password),
          },
        },
      ],
    });
  });
  test("should response a error", async () => {
    let account = { username: "username", password: "pass123" };
    let error;
    try {
      await userService.login(account);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("invalid password!");
  });
});

describe("refresh token passed", () => {
  let refreshToken = "refreshToken";
  beforeEach(() => {
    esCommon.getByFieldName.mockReturnValue({
      status: 200,
      total: 1,
      hits: [
        {
          _source: {
            ...data,
            password: md5(data.password),
            refreshToken,
          },
        },
      ],
    });
    handleJWT.deCodedToken.mockReturnValue({
      username: data.username,
      password: data.password,
    });
  });
  test("should response a new token and refreshToken", async () => {
    const resp = await userService.refreshToken(refreshToken);
    expect(resp).toHaveProperty("token");
  });
});

describe("refresh token missing", () => {
  let refreshToken = "refreshToken";
  beforeEach(() => {
    esCommon.getByFieldName.mockReturnValue({
      status: 200,
      total: 0,
      hits: [],
    });
  });
  test("should response a error", async () => {
    let error;
    try {
      await userService.refreshToken(refreshToken);
    } catch (err) {
      error = err.name;
    }
    expect(error).toEqual("refresh token not found!");
  });
});
