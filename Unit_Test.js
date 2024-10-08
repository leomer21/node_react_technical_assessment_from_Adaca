const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./API_Endpoint_with_MongoDB"); // Import your Express app

// Connect to the test database before running tests
beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/todoTest", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up the database after each test
afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

// Close the connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe("Todo API", () => {
  let todoId;

  // Test for creating a todo
  it("should create a new todo", async () => {
    const response = await request(app)
      .post("/api/todos")
      .send({ title: "Test Todo" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe("Test Todo");
    todoId = response.body._id; // Save the ID for later tests
  });

  // Test for getting all todos
  it("should get all todos", async () => {
    await request(app).post("/api/todos").send({ title: "Test Todo 1" });
    await request(app).post("/api/todos").send({ title: "Test Todo 2" });

    const response = await request(app).get("/api/todos");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  // Test for updating a todo
  it("should update an existing todo", async () => {
    const response = await request(app)
      .put(`/api/todos/${todoId}`)
      .send({ title: "Updated Todo" });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Todo");
  });

  // Test for deleting a todo
  it("should delete a todo", async () => {
    await request(app).post("/api/todos").send({ title: "Delete Me" });
    const deleteResponse = await request(app).delete(`/api/todos/${todoId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe("Todo deleted successfully");

    const response = await request(app).get("/api/todos");
    expect(response.body.length).toBe(0); // Ensure the todo is deleted
  });
});
